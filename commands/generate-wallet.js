const axios = require('axios')

async function gerarCarteira(message) {
    try {
        const response = await axios.get("https://cripto-wallet.vercel.app/generate-wallet");
        const carteira = response.data;
        
        return carteira
       
    } catch (error) {
        console.error("Erro ao gerar a carteira:", error);
        message.createMessage("Não foi possível gerar a carteira, tente novamente mais tarde.");
    }
}

module.exports = {
    name: "generate-wallet",
    description: "Generate a bitcoin wallet",
    execute: async (i) => {
        
        let wallet = await gerarCarteira(i)
        console.log(wallet)
        i.createMessage(`Aqui está a sua carteira bitcoin\nAddres: ${wallet.address}\nPrivate key: ${wallet.privateKey}\nSeed: ${wallet.seed}`)
    }
}