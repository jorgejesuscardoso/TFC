import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { LoginInvalido, LoginSemEmail, LoginSemSenha, LoginValido, token } from './mocks/usersMock';
import { emailOrPasswordInvalid, invalidData, invalidToken } from '../utils/MessageResponse';
import * as Validate from '../middlewares/validations';
import { headerInvalido } from './matches.test';


chai.use(chaiHttp);

const { expect } = chai;

describe('Users', () => {
  it('deve retornar um token ao logar', async () => {
    sinon.stub(Validate, 'validateLogin').resolves(LoginValido as any);

    const response = await chai.request(app).post('/login').send(LoginValido);
   
    expect(response.status).to.equal(200);
    expect(response.body).to.be.eql(token);
  });
  it('deve retornar unauthorized ao logar com email inválido', async () => {
    sinon.stub(Validate, 'validateLogin').resolves({ message: emailOrPasswordInvalid } as any);

    const response = await chai.request(app).post('/login').send(LoginInvalido);
   
    expect(response.status).to.equal(401);
    expect(response.body).to.be.eql({ message: emailOrPasswordInvalid });
  });
  it('deve retornar unauthorized ao logar sem senha', async () => {
    sinon.stub(Validate, 'validateLogin').resolves({ message: invalidData } as any);

    const response = await chai.request(app).post('/login').send(LoginSemSenha);

    expect(response.status).to.equal(400);
    expect(response.body).to.be.eql({ message: invalidData });
  });
  it('deve retornar erro ao logar sem email', async () => {
    sinon.stub(Validate, 'validateLogin').resolves({ message: invalidData } as any);

    const response = await chai.request(app).post('/login').send(LoginSemEmail);

    expect(response.status).to.equal(400);
    expect(response.body).to.be.eql({ message: invalidData });
  });
  it('deve retornar erro ao nao ter token', async () => {
    const response = await chai.request(app).get('/login/role').set(headerInvalido);

    expect(response.status).to.equal(401);
    expect(response.body).to.be.eql({ message: invalidToken });
  });
  it('unauthorized ao logar com senha inválida', async () => {
    sinon.stub(Validate, 'validateLogin').resolves({ email: "admi@admi.com", password: '123' } as any);

    const response = await chai.request(app).post('/login').send(LoginInvalido);

    expect(response.status).to.equal(401);
    expect(response.body).to.be.eql({ message: emailOrPasswordInvalid });
  });
  afterEach(() => {
    sinon.restore();
  });
});