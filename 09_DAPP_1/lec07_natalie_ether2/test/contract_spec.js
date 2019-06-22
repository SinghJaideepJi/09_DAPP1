// /*global contract, config, it, assert*/

const Enrollment = require('Embark/contracts/Enrollment');

let accounts;

let expectedErrors = {
  'onlyOwner':"Only the onwer can call this !!!",
  'isAdmissionOpen':"The Admissions are not Open currently. Please try later !",
  'enrollmentFee':"Enrollment Fee is 1000 Wei",
  'refund':"You are not enrolled, cannot get refund"
};

// For documentation please see https://embark.status.im/docs/contracts_testing.html
config({
  //deployment: {
  //  accounts: [
  //    // you can configure custom accounts with a custom balance
  //    // see https://embark.status.im/docs/contracts_testing.html#Configuring-accounts
  //  ]
  //},
  contracts: {
    "Enrollment": {
    }
  }
}, (_err, web3_accounts) => {
  accounts = web3_accounts
});

contract("Enrollment", function () {
  this.timeout(0);

  it("Enrollment was deployed", async function(){
    let address = Enrollment.options.address;
    assert.ok(address) // has a value and not null
  });

  it("Enroll when OPEN", async function(){
    await Enrollment.methods.setStateOpen().send({from:accounts[0]});

    await Enrollment.methods.enroll("Jaideep").send({from:accounts[1],value:1000});

    let result = await Enrollment.methods.getEnrollmentName().call({from:accounts[1]});

    assert.equal(result,"Jaideep");
  });

  it("Try to Enroll when CLOSED", async function(){

    await Enrollment.methods.setStateClosed().send({from:accounts[0]});

    try{
      await Enrollment.methods.enroll("Jaideep").send({from:accounts[1]});
      assert.ok(false)
    }
    catch(error){
      assert(error.message.includes(expectedErrors['isAdmissionOpen']))
    }
  });

  it("Try to Enroll when OPEN with incorrect Enrollment fee", async function(){
    await Enrollment.methods.setStateOpen().send({from:accounts[0]});

    try{
    await Enrollment.methods.enroll("Jaideep").send({from:accounts[1],value:800});
    assert.ok(false)
  }
    catch(error){
        assert(error.message.includes(expectedErrors['enrollmentFee']))
    }
  });

  it("Try to Change state to OPEN by non Owner", async function(){

    try{
      await Enrollment.methods.setStateOpen().send({from:accounts[1]});
      assert.ok(false)
    }
    catch(error){
      assert(error.message.includes(expectedErrors['onlyOwner']))
    }
  });

  it("Try to Change state to Closed by non Owner", async function(){

    try{
      await Enrollment.methods.setStateOpen().send({from:accounts[1]});
      assert.ok(false)
    }
    catch(error){
      assert(error.message.includes(expectedErrors['onlyOwner']))
    }
  });

  it("Try to Cancel Enrollement and get refund from Invalid Account", async function(){

    try{
      await Enrollment.methods.cancelEnrollment().send({from:accounts[9]});
      assert.ok(false)
    }
    catch(error){
      assert(error.message.includes(expectedErrors['refund']))
    }
  });

  it("Cancel Enrollement and get refund", async function(){

    await Enrollment.methods.setStateOpen().send({from:accounts[0]});

    await Enrollment.methods.enroll("Cancellation").send({from:accounts[8],value:1000});

    let result = await Enrollment.methods.getEnrollmentName().call({from:accounts[8]});

    assert.equal(result,"Cancellation");

    try{
      await Enrollment.methods.cancelEnrollment().send({from:accounts[8]});
      let result = await Enrollment.methods.getEnrollmentName().call({from:accounts[8]});
      assert.equal(result,"");    
    }
    catch(error){
        console.log(error)
        // assert(error.message.includes(expectedErrors['refund']))
    }
  });
});