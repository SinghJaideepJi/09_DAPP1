## Ethers Assignment

#### Developed by:-  
- Jaideep Singh 

### Dapps interaction with EthersJS in Student Enrollment Application :-

#### Where does your DApp interact with the blockchain at a network level? 

We can use the transaction count function provided by ethersJs to keep a note of the nounce and hence preventing duplicate transactions.

#### Where does your DApp interact with smart contracts?

The DApp will interact with the Smart Contract for the Enrollment of an applicant, to deposit the registration fees and for withdrawl from the enrollment to get a partial refund of registration fees.

#### How are are external accounts created and managed

Each applicant will have their public and private keys and the wallet will be used to sign transactions on their behalf to enroll or to withdraw from the course.

#### What cryptographic functions are needed?

We shall use keccak256 function to has the value passed by the user. Also keccak256 can be used for String comparision in smart contracts.