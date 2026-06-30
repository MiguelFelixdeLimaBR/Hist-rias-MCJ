const express = require('express');
const exphbs = require('express-handlebars');
const sequelize = require('./config/bd');
const app = express();
const { Op } = require('sequelize');
const Discente = require('./models/discente.models');
const Solicitacao = require('./models/solicitacao.models');
const Duvidas = require('./models/duvidas.models');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());  

app.engine('handlebars', exphbs.engine({
  defaultLayout: false,
  helpers: {
    if_eq: function (a, b, opts) {
      return String(a).toLowerCase() === String(b).toLowerCase()
        ? opts.fn(this)
        : opts.inverse(this);
    }
  }
}));
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



//CRUD Solicitações, responsável: Miguel Félix
app.get('/discente/criaslc', async (req, res) => {
    res.render('criarsolicitacoes');
});
app.post('/discente/criaslc', async (req, res) => {
    const { discente, matricula, titulo, causa } = req.body;
    await Solicitacao.create({ discente, matricula, titulo, causa });
    res.redirect('/discente/listarslc');
});

app.get('/secretaria/listarslc', async (req, res) => {
  try {
    const soli = await Solicitacao.findAll({where: {resolvido: false}, raw: true});
    res.render('listasolicitacoes', { soli });
  } catch (erro) {
    console.error('Erro ao listar solicitações:', erro);
    res.status(500).send('Erro ao carregar solicitações');
  }
});
app.put('/solicitacao/approve/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const slc = await Solicitacao.findByPk(id);
    if (!slc) return res.status(404).send('Solicitação não encontrada');
    slc.resolvido = true;
    slc.status = 'Aprovada';
    await slc.save();
    res.redirect('/secretaria/listarslc');
  } catch (erro) {
    console.error('Erro ao aprovar solicitação:', erro);
    res.status(500).send('Erro ao aprovar solicitação');
  }
});

app.put('/solicitacao/reject/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const slc = await Solicitacao.findByPk(id);
    if (!slc) return res.status(404).send('Solicitação não encontrada');
    slc.resolvido = true;
    slc.status = 'Rejeitada';
    await slc.save();
    res.redirect('/secretaria/listarslc');
  } catch (erro) {
    console.error('Erro ao rejeitar solicitação:', erro);
    res.status(500).send('Erro ao rejeitar solicitação');
  }
});
app.get('/discente/listarslc', async (req, res) => {
  try {
    const soli = await Solicitacao.findAll({raw: true});
    res.render('listasolicitacoes2', { soli });
  } catch (erro) {
    console.error('Erro ao listar solicitações:', erro);
    res.status(500).send('Erro ao carregar solicitações');
  }
});

app.get('/slcedit/:id', async (req, res) =>{
      try {
        const id = req.params.id;
        const slc = await Solicitacao.findByPk(id, {raw:true});

        res.render('editarsolicitacao', { slc });
    } catch (erro) {
        console.error('Erro ao editar solicitacao:', erro);
        res.status(500).send('Erro ao editar solicitacao');
    }
});
app.put(
    '/slcedit/:id', async(req, res) => {
      try {
        const id = req.params.id;
        const discente = req.body.discente;
        const matricula = req.body.matricula;
        const titulo = req.body.titulo;
        const causa = req.body.causa;

        const slc = await Solicitacao.findByPk(id);

        slc.discente = discente;
        slc.titulo = titulo;
        slc.matricula = matricula;
        slc.causa = causa;
        await slc.save();

        res.redirect('/discente/listarslc');
    } catch (erro) {
        console.error('Erro ao editar solicitacao:', erro);
        res.status(500).send('Erro ao atualizar a solicitação!');
    }}
);

app.delete('/solitedele/:id', async(req,res) =>{
  try {
    const id = req.params.id;
    const soli = await Solicitacao.findByPk(id);
    soli.destroy()
    res.redirect('/discente/listarslc')
    } catch (erro) {
      console.error('Erro ao deletar solicitacao:', erro);
      res.status(500).send('Erro ao deletar solicitacao');
  }}
);



//CRUD Dúvidas, responsável: João Vitor
app.get('/discente/criarduvida', async (req, res) => {
    res.render('cadastrarduvidas');
});
app.post('/discente/criarduvida', async (req, res) => {
    const { nome, duvida } = req.body;
    await Duvidas.create({ nome, duvida });
    res.redirect('/discente/listarduvidas2');
});

app.get('/discente/listarduvidas2', async (req, res) => {
  try {
    const duvidas = await Duvidas.findAll({raw: true});
    res.render('listarduvidas2', { duvidas });
  } catch (erro) {
    console.error('Erro ao listar dúvidas:', erro);
    res.status(500).send('Erro ao carregar dúvidas');
  }}
);
app.get('/secretaria/listarduvidas', async (req, res) => {
  try {
    const duvidas = await Duvidas.findAll({
      where: {
        status: {
          [Op.or]: ['pendente', 'Pendente']
        }},
      raw: true
    });
    res.render('listarduvidas', { duvidas });
  } catch (erro) {
    console.error('Erro ao listar dúvidas:', erro);
    res.status(500).send('Erro ao carregar dúvidas');
  }
});

app.get('/duvidaedit/:id', async (req, res) =>{
      try {
        const id = req.params.id;
        const dvd = await Duvidas.findByPk(id, {raw:true});

        res.render('editarduvida', { dvd });
    } catch (erro) {
        console.error('Erro ao editar dúvida:', erro);
        res.status(500).send('Erro ao editar dúvida');
    }
});
app.put(
    '/duvidaedit/:id', async(req, res) => {
      try {
        const id = req.params.id;
        const nome = req.body.nome;
        const duvida = req.body.duvida;

        const dvd = await Duvidas.findByPk(id);
        if (!dvd) return res.status(404).send('Dúvida não encontrada');

        dvd.nome = nome;
        dvd.duvida = duvida;
        await dvd.save();

        res.redirect('/discente/listarduvidas2');
    } catch (erro) {
        console.error('Erro ao editar dúvida:', erro);
        res.status(500).send('Erro ao atualizar a dúvida!');
    }}
);

app.delete('/duvidadele/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const dv = await Duvidas.findByPk(id);
    if (!dv) return res.status(404).send('Dúvida não encontrada');
    await dv.destroy();
    res.redirect('/discente/listarduvidas2');
  } catch (erro) {
    console.error('Erro ao deletar a dúvida:', erro);
    res.status(500).send('Erro ao deletar a dúvida');
  }
});

app.get('/secretaria/reponderduvidas/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const rsp = await Duvidas.findByPk(id, { raw: true });

    res.render('respostaduvida', { rsp });
  } catch (erro) {
    console.error('Erro ao editar dúvida:', erro);
    res.status(500).send('Erro ao editar dúvida');
  }
});

app.put('/secretaria/reponderduvidas/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const resposta = req.body.resposta;
    const status = req.body.status;

    const rsp = await Duvidas.findByPk(id);
    if (!rsp) return res.status(404).send('Dúvida não encontrada');

    rsp.resposta = resposta;
    rsp.status = status;
    await rsp.save();

    res.redirect('/secretaria/listarduvidas');
  } catch (erro) {
    console.error('Erro ao enviar resposta:', erro);
    res.status(500).send('Erro ao enviar resposta!');
  }
});

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