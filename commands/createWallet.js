const axios = require('axios');

async function gerarCarteira() {
    try {
        const response = await axios.get("https://cripto-wallet.vercel.app/generate-wallet");
        const carteira = response.data;
        console.log("Carteira gerada:", carteira);
        return carteira;
    } catch (error) {
        console.error("Erro ao gerar a carteira:", error);
        return null;
    }
}

module.exports = {
    name: "create-wallet",
    description: "Generate a bitcoin wallet",
    execute: async (i) => {
        try {
            
            await i.acknowledge();

            const wallet = await gerarCarteira();
            console.log("Carteira recebida:", wallet);

            if (wallet) {
                console.log("Enviando carteira para o usuário...");
                i.createMessage({
                    content: `Aqui está a sua carteira bitcoin\nAddress: ${wallet.address}\nPrivate key: ${wallet.privateKey}\nSeed: ${wallet.seed}`,
                    flags: 64  
                });
                console.log("Carteira enviada!")
            } else {
                console.error("Erro: Carteira não gerada.");
                i.createMessage({
                    content: "Houve um erro ao gerar a carteira. Tente novamente mais tarde.",
                    flags: 64  
                });
            }
        } catch (error) {
            console.error("Erro ao processar o comando:", error);
            i.createMessage({
                content: "Houve um erro ao processar o comando. Tente novamente.",
                flags: 64
            });
        }
    }
};
