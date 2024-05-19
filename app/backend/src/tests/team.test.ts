import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamsModel from '../database/models/TeamsModel';
import { Teams } from './mocks/teamsMock';

import { DbErrorMsg } from './mocks/messagesStatus';
import { teamNotFound } from '../utils/MessageResponse';

chai.use(chaiHttp);

const { expect } = chai;

describe('Teams', () => {
  /**
   * Exemplo do uso de stubs com tipos
   */

  // let chaiHttpResponse: Response;

  // before(async () => {
  //   sinon
  //     .stub(Example, "findOne")
  //     .resolves({
  //       ...<Seu mock>
  //     } as Example);
  // });

  // after(()=>{
  //   (Example.findOne as sinon.SinonStub).restore();
  // })

  // it('...', async () => {
  //   chaiHttpResponse = await chai
  //      .request(app)
  //      ...

  //   expect(...)
  // });

  it('should return a list of teams', async () => {
    sinon.stub(TeamsModel, 'findAll').resolves(Teams as any);

    const { status, body } = await chai.request(app).get('/teams');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(Teams);
  });
  it('deve retornar erro status 500', async () => {
    sinon.stub(TeamsModel, 'findAll').rejects(new Error('Erro'));

    const { status, body } = await chai.request(app).get('/teams');

    expect(status).to.equal(500);
    expect(body).to.deep.equal({ message: DbErrorMsg, id: '' });
  });
  it('deve retornar 1 time', async () => {
    sinon.stub(TeamsModel, 'findByPk').resolves(Teams[0] as any);

    const { status, body } = await chai.request(app).get('/teams/1');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(Teams[0]);
  });
  it('deve retornar not found', async () => {
    sinon.stub(TeamsModel, 'findByPk').resolves(null);

    const { status, body } = await chai.request(app).get('/teams/1');

    expect(status).to.equal(404);
    expect(body).to.deep.equal({ message: teamNotFound, id: '' });
  });
  it('deve retornar erro status 500', async () => {
    sinon.stub(TeamsModel, 'findByPk').rejects(new Error('Erro'));

    const { status, body } = await chai.request(app).get('/teams/1');

    expect(status).to.equal(500);
    expect(body).to.deep.equal({ message: DbErrorMsg, id: '' });
  });
  afterEach(() => {
    sinon.restore();
  });
});
