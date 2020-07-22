exports.post_docdetails =(req, res, next) => {
    console.log("enter the function")
    const DocHash = req.body.docHash;
    const Name = req.body.name;
    const Type = req.body.type;
    const Size = req.body.size;
    const Permissions = req.body.permissions;
    const LastModified = req.body.lastModified;
    console.log(DocHash,Name,Type,Size,Permissions,LastModified)
 

console.log('hi');
const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', 'connection-org1.json');

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('codezero');

        // Submit the specified transaction.
        await contract.submitTransaction('invokeDetails', DocHash, Name, Type, Size, Permissions, LastModified);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();

}

exports.get_docdetails =(req, res, next) => {
    const Name = req.params.name;

    const { FileSystemWallet, Gateway } = require('fabric-network');
    const path = require('path');
    
    const ccpPath = path.resolve(__dirname, '..', 'connection-org1.json');
    
    async function main() {
        try {
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (!userExists) {
                console.log('An identity for the user "user1" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');
    
            // Get the contract from the network.
            const contract = network.getContract('codezero');
    
            // Evaluate the specified transaction.
            const result = await contract.evaluateTransaction('readDetails', Name);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            process.exit(1);
        }
    }
    
    main();
}