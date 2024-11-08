


client.on('ready', async () => {
    console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
  
    // Limpar comandos e re-adicionar para garantir que estejam atualizados
    const existingCommands = await client.getCommands();
    existingCommands.forEach(async (cmd) => {
      if (cmd.name === "wiki") await client.deleteCommand(cmd.id);
    });
  
    // Aguarde um pouco antes de registrar novamente (opcional)
    await new Promise(resolve => setTimeout(resolve, 5000));
  
    // Adicione o comando globalmente
    client.createCommand({
      name: "wiki",
      description: "Faça uma pesquisa na Wikipedia",
      options: [
        {
          name: "termo",
          description: "Sua pesquisa",
          type: Constants.ApplicationCommandOptionTypes.STRING,
          required: true
        }
      ]
    });
  
    console.log("Comandos carregados e registrados globalmente.");
  });
  