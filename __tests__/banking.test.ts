import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/app';

describe('Banking Operations Integration Tests', () => {

  let testAccountId: number;

  it('1. should create a new account successfully', async () => {

    const response = await request(app)
      .post('/accounts')
      .send({

        personId: 1,
        dailyWithdrawalLimit: 5000,
        accountType: 1,
        initialBalance: 0

      });

    expect(response.statusCode).toBe(201);

    expect(response.body).toHaveProperty('accountId');
    expect(response.body.balance).toBe(0);
    
    
    testAccountId = response.body.accountId; 
  });

  it('2. should deposit money into the account', async () => {
    const response = await request(app)
      .post(`/accounts/${testAccountId}/deposit`)
      .send({ amount: 1000 });

    expect(response.statusCode).toBe(200);
    expect(response.body.balance).toBe(1000);

  });


  it('3. should get the correct account balance', async () => {
    const response = await request(app).get(`/accounts/${testAccountId}/balance`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.balance).toBe(1000);


  });




  it('4. should withdraw money successfully', async () => {

    const response = await request(app)
      .post(`/accounts/${testAccountId}/withdraw`)
      .send({ amount: 300 });

    expect(response.statusCode).toBe(200);
    expect(response.body.balance).toBe(700);

  });

  

  it('5. should fail to withdraw more money than the balance', async () => {
    const response = await request(app)
      .post(`/accounts/${testAccountId}/withdraw`)
      .send({ amount: 9000 });

  
    expect(response.statusCode).toBe(400); 
    expect(response.body.error).toBe("Insufficient funds");
  });

  


  it('6. should block the account successfully', async () => {
    const response = await request(app).patch(`/accounts/${testAccountId}/block`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.activeFlag).toBe(false);

  });



  it('7. should not allow deposit on a blocked account', async () => {
    const response = await request(app)
      .post(`/accounts/${testAccountId}/deposit`)
      .send({ amount: 100 });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Account is blocked");

  });

  
});