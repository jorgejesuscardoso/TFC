import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { LoginValido } from './mocks/usersMock';
import * as Validate from '../middlewares/validations';
import MatchesController from '../controller/MatchesController';
import { AllMatchesMock, AllMatchesMockInProgressFalse, AllMatchesMockInProgressTrue, FINISHED_MATCHES_MSG, MATCH_NOT_FOUND_MSG, createMatchMock, findMatchesMock, leaderBoardHomeTeamMock, patchMatchMock, upDateGoalsMock } from './mocks/MatchesMock';
import { TOKEN_INVALIDO, TOKEN_VALIDO } from './mocks/TOKEN';
import * as leaderBoard from '../routes/leaderboard';


chai.use(chaiHttp);

const { expect } = chai;


const MatchesControl = new MatchesController();


export const headerValido = { 
  Authorization: `Bearer ${TOKEN_VALIDO}`
}

export const headerInvalido = { 
  Authorization: `Bearer ${TOKEN_INVALIDO}`
}

describe('Matches', () => {
  it('deve retornar status 200 e a role ao fazer requisição com um token valido', async () => {
    sinon.stub(Validate, 'validateLogin').resolves(LoginValido as any);
    
    const res = await chai.request(app).post('/login/role').send(LoginValido);
    
    expect(res.status).to.be.equal(200);
    const token = res.body.token;

    sinon.stub(Validate, 'TokenValidation').resolves({ role: 'admin' } as any);

    const res2 = await chai.request(app).get('/login/role').set('Authorization', `Bearer ${token}`);

    expect(res2.status).to.be.equal(200);
    expect(res2.body).to.be.eql({ role: 'admin' });
  });
  it('deve retornar status 401 ao fazer requisição com um token invalido', async () => {
    sinon.stub(Validate, 'TokenValidation').resolves('token invalido' as any);

    const res = await chai.request(app).get('/login/role').set('Authorization', `Bearer token invalido`);

    expect(res.status).to.be.equal(401);
  });
  it('deve retornar status 401 ao fazer requisição sem um token', async () => {
    const res = await chai.request(app).get('/login/role');

    expect(res.status).to.be.equal(401);
  });
  it('deve retornar status 200 e um array de matches ao fazer requisição para /matches', async () => {
    sinon.stub(MatchesControl,'findAllMatches').resolves(AllMatchesMock as any);

    const res = await chai.request(app).get('/matches');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
  });
  it('deve retornar status 200 e array com os times da casa', async () => {
    sinon.stub(MatchesControl,'findAllMatches').resolves(leaderBoardHomeTeamMock as any);

    const res = await chai.request(app).get('/matches/home');
    expect(res.status).to.be.equal(200);
  });
  it('deve retornar todas as partidas em andamento', async () => {
    sinon.stub(MatchesControl,'findAllMatches').resolves(AllMatchesMockInProgressTrue as any);

    const res = await chai.request(app).get('/matches?inProgress=true');
    expect(res.status).to.be.equal(200);
  });
  it('deve retornar todas as partidas finalizadas', async () => {
    sinon.stub(MatchesControl,'findAllMatches').resolves(AllMatchesMock as any);

    const res = await chai.request(app).get('/matches?inProgress=false');
    expect(res.status).to.be.equal(200);
  });
  it('deve finalizar uma partida ao acessar a rota /matches/:id/finish', async () => {
    sinon.stub(MatchesControl,'findMatchById').resolves(FINISHED_MATCHES_MSG as any);

    const res = await chai.request(app).patch('/matches/1/finish').set(headerValido);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.deep.equal({ message: 'Finished' });
  });
  it('NÃO deve finalizar uma partida ao passar a toeken inválido na rota /matches/:id/finish', async () => {
    sinon.stub(MatchesControl,'findMatchById').resolves(FINISHED_MATCHES_MSG as any);
    const res = await chai.request(app).patch('/matches/1/finish').set(headerInvalido);
    expect(res.status).to.be.equal(401);
    expect(res.body).to.be.deep.equal({ message: 'Token must be a valid token' });
  });
  it('notfound se não encontrar a partida ao tentar finaliza-la', async () => {
    sinon.stub(MatchesControl,'finishMatchById').resolves(MATCH_NOT_FOUND_MSG as any);

    const res = await chai.request(app).patch('/matches/1111/finish').set(headerValido);
    expect(res.status).to.be.equal(404);
    expect(res.body).to.be.deep.equal(MATCH_NOT_FOUND_MSG);
  });
  it('deve atualizar os gols de uma partida ao acessar a rota /matches/:id', async () => {
    sinon.stub(MatchesControl,'findMatchById').resolves(upDateGoalsMock as any);

    const res = await chai.request(app).patch('/matches/1').set(headerValido).send(upDateGoalsMock);
    expect(res.status).to.be.equal(200);
  });
  it('deve retornar notfound se não encontrar a partida ao tentar atualizar os gols', async () => {
    sinon.stub(MatchesControl,'findMatchById').resolves(MATCH_NOT_FOUND_MSG as any);

    const res = await chai.request(app).patch('/matches/1111').set(headerValido).send(upDateGoalsMock);
    expect(res.status).to.be.equal(404);
    expect(res.body).to.be.deep.equal(MATCH_NOT_FOUND_MSG);
  });
  it('deve criar uma partida ao acessar a rota /matches', async () => {
    const res = await chai.request(app).post('/matches').set(headerValido).send(createMatchMock);
    expect(res.status).to.be.equal(201);
  });
  it('deve retornar status 422 ao tentar criar uma partida com dados inválidos', async () => {
    const res = await chai.request(app).post('/matches').set(headerValido).send({ homeTeamId: 1, awayTeamId: 1 });
    expect(res.status).to.be.equal(422);
    expect(res.body).to.be.deep.equal({ message: 'It is not possible to create a match with two equal teams', });
  });
  it('deve retornar todos os times com inProgress false e q é times da casa', async () => {
    sinon.stub(MatchesControl,'leaderBoardHome').resolves(leaderBoardHomeTeamMock as any);

    const res = await chai.request(app).get('/leaderboard/home');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
  });
  it('deve retornar todos os times com inProgress false e q é times de fora', async () => {
    sinon.stub(MatchesControl,'leaderBoardAway').resolves(leaderBoardHomeTeamMock as any);

    const res = await chai.request(app).get('/leaderboard/away');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
  });
  it('deve retornar todos os times com inProgress false e q é times da casa e de fora', async () => {
    sinon.stub(MatchesControl,'leaderBoardHome').resolves(leaderBoardHomeTeamMock as any);

    const res = await chai.request(app).get('/leaderboard');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
  });
  afterEach(() => {
    sinon.restore();
  });
});