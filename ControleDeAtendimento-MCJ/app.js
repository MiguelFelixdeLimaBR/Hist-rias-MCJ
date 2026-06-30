const express = require('express');
const exphbs = require('express-handlebars');
const sequelize = require('./config/bd');
const app = express();
const Discente = require('./models/discente.models');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());  

app.engine('handlebars', exphbs.engine({defaultLayout: false}));
app.set('view engine', 'handlebars');

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/discente', (req, res) => {
    res.render('discente');
});

app.get('/secretaria', (req, res) => {
    res.render('secretaria');
});

// CRUD Discentes, responsável: Caio Roberto
app.get('/discente/create', async (req, res) => {
    res.render('cadastrardiscente');
});
app.post('/discente/create', async (req, res) => {
   try{
    const { nome, idade, email, matricula, curso } = req.body;
    await Discente.create({ nome, idade, email, matricula, curso });
    res.redirect('/listardiscentes');
   } catch (erro) {
    console.error('Erro ao criar Discente:', erro);
    res.status(500).send('Erro ao criar Discente');
   }
});

app.get('/listardiscentes', async (req, res) => {
  try {
    const discente = await Discente.findAll({raw: true});
    res.render('listardiscentes', { discente });
  } catch (erro) {
    console.error('Erro ao listar Discentes:', erro);
    res.status(500).send('Erro ao carregar Discentes');
  }
});

app.get(
    '/discenteedit/:id', async (req, res) =>{
      try {
        const id = req.params.id;
        const discente = await Discente.findByPk(id, {raw:true});

        res.render('editardiscente', { discente });
    } catch (erro) {
        console.error('Erro ao atualizar Discente:', erro);
        res.status(500).send('Erro ao atualizar Discente');
    }
});
app.put(
    '/discenteedit/:id', async(req, res) => {
      try {
        const id = req.params.id;
        const nome = req.body.nome;
        const idade = req.body.idade;
        const matricula = req.body.matricula;
        const email = req.body.email;
        const curso = req.body.curso;

        const discente = await Discente.findByPk(id);

        discente.nome = nome;
        discente.idade = idade;
        discente.matricula = matricula;
        discente.email = email;
        discente.curso = curso;
        await discente.save();

        res.render('editardiscente', { discente });
    } catch (erro) {
        console.error('Erro ao atualizar Discente:', erro);
        res.status(500).send('Erro ao atualizar Discente');
    }}
);

app.delete('/discentedele/:id', async(req,res) =>{
  try {
    const id = req.params.id;
    const discente = await Discente.findByPk(id);
    discente.destroy()
    res.redirect('/secretaria')
    } catch (erro) {
      console.error('Erro ao deletar Discente:', erro);
      res.status(500).send('Erro ao deletar Discente');
  }}
);

async function conectarBD() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  } catch (erro) {
    console.error('Erro ao conectar:', erro);
  }
};

conectarBD();

app.listen(
    3000,
    () => console.log('Servidor em execução')
);