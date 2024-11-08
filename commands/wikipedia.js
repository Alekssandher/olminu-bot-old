const wiki = require('wikipedia');


const cache = new Map();

const search = async (target) => {
    try {
       
        if (cache.has(target)) {
            return cache.get(target);
        }

        await wiki.setLang('pt');
        const searchResults = await wiki.search(target, { suggestion: true, limit: 10 });

        if (!searchResults.results || searchResults.results.length === 0) {
            throw new Error("Nenhum resultado encontrado.");
            
        }

        const firstResultTitle = searchResults.results[0].title;
        const page = await wiki.page(firstResultTitle);

      
        const [title, response, url] = await Promise.all([
            page.title,
            page.summary(),
            page.fullurl
        ]);

        const text = response.extract;
        
       
        const result = { title, text, url };
        cache.set(target, result);

        return result;
    } catch (error) {
        console.error("Erro na busca Wikipedia:", error);
        throw error;
    }
};

module.exports = {
    name: "wiki",
    description: "Get information from Wikipedia",
    options: [
        {
            name: "termo",
            description: "sua pesquisa",
            type: 3,
            required: true
        },
    ],
    execute: async (i) => {
        try {            
            await i.acknowledge();
            const searchTerm = i.data.options.find(opt => opt.name === 'termo').value;
            const page = await search(searchTerm);

            const { title, text, url } = page;

            i.createMessage({
                embeds: [{
                    title: title,
                    description: text,
                    url: url
                }]
            });
        } catch (error) {
            console.error("Erro ao executar comando wiki:", error);
            i.createMessage({
                content: "Ocorreu um erro ao buscar informações na Wikipedia. Por favor, tente novamente mais tarde."
            });
        }
    }
};
