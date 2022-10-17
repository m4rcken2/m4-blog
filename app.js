const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const {engine}= require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const flash  = require('connect-flash')
const path = require('path')
const admin = require('./routes/admin')
const usuarios = require('./routes/usuarios')
const { Console } = require('console')
require('./models/Postagem')
const Postagem = mongoose.model('postagens')
require('./models/Categoria')
const Categoria = mongoose.model('categorias')

//Configurations
    //Session
        app.use(session({
            secret: "NodeCourse",
            resave: true,
            saveUninitialized: true
        }))
    //Flash
    app.use(flash())
    //Middleware
    app.use((req,res,next)=>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })
    //BodyParser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
    app.engine('handlebars', engine({defaultLayout:'main', runtimeOptions:{
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }}))
    app.set('view engine', 'handlebars')
    app.set('views', './views')
    //Public 
        app.use(express.static(path.join(__dirname,'public')))
    //Mongoose
        mongoose.connect('mongodb://localhost/blogapp').then(()=>{
            console.log('Conectado ao base de dadoscom sucesso')
        }).catch((err)=>{
            console.log('Houve um erro ao se conectar: ' + err)
        })

//Routes
    app.use('/admin', admin)
    app.use('/usuarios',usuarios)

    app.get('/', (req,res)=>{
        Postagem.find().populate('categoria').sort({data: 'desc'}).then((postagens)=>{
            res.render('index', {postagens: postagens})
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro interno')
            res.redirect('/404')
        })
    })

    app.get('/404',(req,res)=>{
        res.send('Erro 404!')
    })

    app.get('/postagens/:slug', (req,res)=>{
        Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
            if(postagem){
                res.render('postagem/index', {postagem:postagem})
            }else{
                req.flash('error_msg','Essa postagem não existe')
                res.redirect('/')
            }
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro interno')
            res.redirect('/')
        })
    })

    app.get('/categorias', (req,res)=>{
        Categoria.find().then((categorias)=>{
            res.render('categorias/index', {categorias: categorias})
        })
    })

    app.get('/categorias/:slug',(req,res)=>{
        Categoria.findOne({slug:req.params.slug}).then((categoria)=>{
            if(categoria){
                Postagem.find({categoria:categoria}).then((postagens)=>{
                    res.render('categorias/postagens', {postagens: postagens, categoria:categoria})
                }).catch()
            }else{
                req.flash('error_msg','Houve um errro ao listar os posts')
                res.redirect('/')

            }
        }).catch((err)=>{
            req.flash('error_msg','Essa categoria não existe')
            res.redirect('/')
        })
    })
//server running 
    const PORT = 8020
    app.listen(PORT, ()=>{
        console.log('O Servidor rodando na url https://localhost:' +PORT)
    })