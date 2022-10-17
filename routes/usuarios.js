const express = require('express')
const router = express.Router()

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

}
})
module.exports = router