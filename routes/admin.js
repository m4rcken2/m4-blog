const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')

router.get('/', (req, res)=>{
    res.render('admin/index')
})

router.get('/categorias', (req, res)=>{
    Categoria.find().then((categorias)=>{
        res.render('admin/categorias', {categorias: categorias})
    }).catch(()=>{
        req.flash('error_msg', "Houve um problema ao listar as categorias")
        res.redirect('/admin')
    })
})

router.get('/novacategoria',(req, res)=>{
    res.render('admin/novacategoria')
})

router.post('/categorias/add', (req, res)=>{
    var errors = []
    if(!req.body.nome || req.body.nome == null){
        errors.push({texto:"Nome invalido"})
    }
    if(!req.body.slug || req.body.slug == null){
        errors.push({texto:"Slug invalido"})
    }
    if(errors.length > 0){
        res.render('admin/novacategoria', {errors: errors})
    }else{
        const novaCategoria = {
            nome : req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(()=>{
            req.flash('success_msg', "Categoria criada com sucesso")
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao salvar a categoria, Tente novamente!")
            res.redirect('/admin')
        })
    }
})
 router.get('/categorias/edit/:id', (req,res)=>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render('admin/editcategoria', {categoria: categoria})
    }).catch((err)=>{
        req.flash('error_msg', "Houve um erro oa sal")
    })
 })

 router.post('/categorias/edit',(req,res)=>{
    Categoria.findOne({_id : req.body.id}).then((categoria)=>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
            req.flash('success_msg', 'Categoria editada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            req.flash('error_msg', "Oupsss!Houve um erro interno ao editar a categoria")
        })
    }).catch(()=>{
        req.flash('error_msg', "Houve um erro ao editar a categoria")
        res.redirect('/admin/categorias')
    })
 })

 router.post('/categorias/deletar', (req,res)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'Categoria deleta com sucesso')
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um problema ao deletar a categoria')
        res.redirect('/admin/categorias')
    })

    })

    router.get('/postagens', (req,res)=>{
        Postagem.find().populate('categoria').sort({data: 'desc'}).then((postagens)=>{
            res.render('admin/postagens', {postagens:postagens})
        }).catch()
    })

    router.get('/postagens/add', (req,res)=>{
        Categoria.find().then((categorias)=>{
            res.render('admin/novapostagem', {categorias:categorias})
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro ao carregar o formulario')
            res.redirect('/admin')
        })
       
    })

    router.post('/postagens/nova',(req,res)=>{
        var erros =[]

        if(req.body.categoria == "0"){
            erros.push({texto: "Categoria inválida, registre uma categoria"})
        }
        if(erros.length > 0){
            res.render('/admin/novapostagem', {erros:erros})
        }else{
            const novaPostagem = {
                titulo: req.body.titulo,
                slug: req.body.slug,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo,
                categoria: req.body.categoria
            }
        new Postagem(novaPostagem).save().then(()=>{
            req.flash('success_msg','Postagem salva com sucesso')
            res.redirect('/admin/postagens')
        }).catch(()=>{
            req.flash('error_msg','Houve um problema ao salvar a postagem')
            res.redirect('/admin/postagens')
        })
        }
    })

    router.get('/postagens/edit/:id', (req,res)=>{
        Postagem.findOne({_id:req.params.id}).then((postagem)=>{
            Categoria.find().then((categorias)=>{
                res.render('admin/editpostagem', {categorias:categorias, postagem:postagem})
            }).catch((err)=>{
                req.flash('error_msg','Houve um erro ao listar as categorias')
                res.redirect('/admin/postagens')
            })
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro ao carregar o formulario de edição')
            res.redirect('/admin/postagens')
        })
    })
    
    router.post('/postagem/edit', (req,res)=>{
        Postagem.findOne({_id:req.body.id}).then((postagem)=>{
            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug
            postagem.descricao = req.body.descricao
            postagem.conteudo =req.body.conteudo
            postagem.categoria = req.body.categoria
            postagem.save().then(()=>{
            req.flash('success_msg','Postagem editada com sucesso')
            res.redirect('/admin/postagens')
           }).catch((err)=>{
            req.flash('error_msg','Erro interno')
            res.redirect('/admin/postagens')
        })

        }).catch((err)=>{
            req.flash('error_msg','Houve um erro ao salvar a edição')
            res.redirect('/admin/postagens')
        })
    })

    router.get("/postagens/deletar/:id", (req, res)=>{
        Postagem.remove({_id:req.params.id}).then(()=>{
            req.flash('success_msg', 'Postagem deletada com sucesso')
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            req.flash('error_msg', 'Houveum erro interno')
            res.redirect('/admin/postagens')
        })
    })

module.exports = router