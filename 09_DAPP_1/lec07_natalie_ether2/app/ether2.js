const ethers = require('ethers');
const express = require('express')
const bodyParser = require('body-parser')
const server=express()

server.use(bodyParser.json());

const contract=require('../build/contracts/Enrollment.json')
require('dotenv').config();

// Get private key from env file. env file will not be pushed to github
const prvKey=process.env.privateKey

let provider = ethers.getDefaultProvider("ropsten");
let wallet = new ethers.Wallet(prvKey,provider);

let bytecode=contract.code
let abi=contract.abiDefinition

// Deploy contract via Ethers Factory

let etherFactory = new ethers.ContractFactory(abi, bytecode, wallet);
async function deployContract()
{
    let contractDethers = await etherFactory.deploy()
    await contractDethers.deployed()
    console.log(contractDethers)
}
deployContract()

// Call functions on contract
let address='0x18440a49AB7729a5C83324130D9C3E7734645de1'
let contract = new ethers.Contract(address, abi, provider);
contractWithSigner=contract.connect(wallet)

async function getEnrollmentName()
{
    let name = await contractWithSigner.getEnrollmentName()
    console.log("The name is",name)
    return(name)
}


server.get('/getEnrollmentName', async (request, response) => {
    let value = await getEnrollmentName();
    response.send(value);
  });
server.listen(process.env.PORT,()=>{
    console.log("The server is running at",process.env.PORT)
})

contractWithSigner.on(“Enrolled”, (name) => {
    console.log(name + " enroled with us !!!");
});
