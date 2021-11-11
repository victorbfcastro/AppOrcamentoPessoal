let bdCadastro = new BD()

async function cadastrarDespesa() {

    let ano = document.getElementById("ano")
    let mes = document.getElementById("mes")
    let dia = document.getElementById("dia")
    let tipo = document.getElementById("tipo")
    let descricao = document.getElementById("descricao")
    let valor = document.getElementById("valor")

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if (despesa.validarDados()) {
        var sucesso = await bdCadastro.gravar(despesa)

        if (sucesso) {
            exibeModal(true)

            //Limpando campos após registro com sucesso
            ano.value = ''
            mes.value = ''
            dia.value = ''
            tipo.value = ''
            descricao.value = ''
            valor.value = ''

            
        } else {
            exibeModal('db')
        }

    } else {
        exibeModal(false)
        
    }
}
