const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')


router.get('/registro', (req,res)=>{
    res.render('usuarios/registro')
})

router.post('/registro', (req,res)=>{
    erros =[]

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.nomeUs || typeof req.body.nomeUs == undefined || req.body.nomeUs == null){
        erros.push({texto: "Nomede usuario inválido"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "senha inválida"})
    }
    if(req.body.senha.length < 6){
        erros.push({texto: "Senha muito curta"})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: 'As senhas não são diferentes, tente novamente'})
    }
if(erros.length>0){
    res.render('usuarios/registro',{erros:erros})
}else{
    Usuario.findOne({email: req.body.email}).then((usuario)=>{
        if(usuario){
            req.flash('error_msg','Esse e-mail já existe no nosso sistema')
            res.redirect('/usuarios/registro')
        }
    Usuario.findOne({usuario: req.body.nomeUs}).then((usuario)=>{
        if(usuario){
            req.flash('error_msg','Esse usuario já cadastrado ')
            res.redirect('/usuarios/registro')
        }else{
            const novoUsuario = new Usuario({
                nome: req.body.nome,
                email: req.body.email,
                usuario: req.body.nomeUs,
                senha: req.body.senha
            })
        bcrypt.genSalt(10, (erro, salt)=>{
            bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=>{
                if(erro){
                    req.flash('error_msg', 'Houve um erro durante o salvamento do usuário')
                    res.redirect('/')
                }
                novoUsuario.senha = hash

                novoUsuario.save().then(()=>{
                    req.flash('success_msg','Usuário criado com sucesso')
                    res.redirect('/')
                }).catch((err)=>{
                    req.flash('error_msg', 'Houve um erro ao criar o usuario, tente novamente!')
                    res.redirect('/')
                })
            })
        })
        }
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro interno')
        res.redirect('/')
    })
    })
}
})
module.exports = router