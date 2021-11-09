class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    //método que valida se todos os dados foram preenchidos e retorna true ou false
    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class BD {
    //No construtor iremos verificar se existe um ID no localStorage e caso negativo, registraremos o Id zero.
    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        //Identifica ultimo valor de ID e incrementa 1 para retornar
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    async gravar(despesa) {
        var jsonBody = {
            "DATA_DESP": `${despesa.dia}-${despesa.mes}-${despesa.ano}`,
            "TIPO": `${despesa.tipo}`,
            "DESCRICAO": `${despesa.descricao}`,
            "VALOR": `${despesa.valor}`
        }

        var response = ''
        const request = await fetch('http://localhost:5000/api/Despesas', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonBody)
        })
            .then(data => response = data)

        if (response.status != undefined && response.status == '200') {
            return true
        }

        return false

    }

    async recuperarTodosRegistros() {
        //Array de despesas
        let despesas = Array()

        var response = ''
        const request = await fetch('http://localhost:5000/api/Despesas')
            .then(T => T.json())
            .then(data => response = data)

        var responseFinal = parseData(response)

        responseFinal.forEach(function (d) {
            despesas.push(d)
        })

        return despesas
    }

    async pesquisar(despesa) {
        /*Recebendo uma despesa pra fazer a pesquisa e filtrar resultado
            Para utilizar o filter do Array:
            
            >> meuarray.filter(function(f) { return minha_primeira_condicao }).filter(function(f) { return minha_segunda_condicao }) etc
            
            podendo ser reduzido a uma arrow function:

            >> meuarray.filter(f => minha_primeira_condicao).filter(f => minha_segunda_condicao)
        */

        let despesasFiltradas = Array()
        despesasFiltradas = await this.recuperarTodosRegistros()

        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(f => f.datA_DESP.getDate() == despesa.dia)
        }

        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(f => f.datA_DESP.getMonth() + 1 == despesa.mes)
        }

        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(f => f.datA_DESP.getFullYear() == despesa.ano)
        }

        if (despesa.tipo != '') {
            switch (despesa.tipo) {
                case '1': despesa.tipo = 'Alimentação'
                    break
                case '2': despesa.tipo = 'Faculdade'
                    break
                case '3': despesa.tipo = 'Lazer'
                    break
                case '4': despesa.tipo = 'Saúde'
                    break
                case '5': despesa.tipo = 'Aluguel'
                    break
                case '6': despesa.tipo = 'Cartão de Crédito'
                    break
                case '7': despesa.tipo = 'Contas Fixas'
                    break
            }
            despesasFiltradas = despesasFiltradas.filter(f => f.tipo == despesa.tipo)
        }

        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(f => f.descricao.includes(despesa.descricao))
        }

        if (despesa.valor != '' && despesa.valor !== undefined) {
            despesasFiltradas = despesasFiltradas.filter(f => f.valor == despesa.valor)
        }

        return despesasFiltradas

    }

    async removerDespesa(id) {
        var response = ''
        const request = await fetch('http://localhost:5000/api/Despesas/' + id, {
            method: 'DELETE',
        })
            .then(data => response = data)

        if (response.status != undefined && response.status == '200') {
            return true
        }

        return false
    }

    async editarDespesa(id, despesa) {
        var jsonBody = {
            "DATA_DESP": despesa.datA_DESP,
            "TIPO": despesa.tipo,
            "DESCRICAO": despesa.descricao,
            "VALOR": despesa.valor
        }
        var response = ''
        const request = fetch('http://localhost:5000/api/Despesas/' + id, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonBody)
        }).then(data => response = data)

        if (response.status != undefined && response.status == '200') {
            return true
        }

        return false
    }
}

let bd = new BD()

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
        var sucesso = await bd.gravar(despesa)

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
            alert("Erro ao adicionar despesa no banco de dados!") //SUBSTITUIR POR MODAL!!
        }

    } else {
        exibeModal(false)

    }

    $("#modalRegistraDespesa").modal("show")

}

function exibeModal(sucesso) {
    let modalTitulo = document.getElementById("modalTitulo")
    let modalConteudo = document.getElementById("modalConteudo")
    let modalButton = document.getElementById("modalButton")

    if (sucesso) {
        modalTitulo.innerHTML = "Sucesso ao Registrar"
        modalTitulo.className += "modal-title text-success"
        modalConteudo.innerHTML = "Despesa adicionada com sucesso!"
        modalButton.className += "btn btn-success"
        modalButton.innerHTML = "OK"

    } else {
        modalTitulo.innerHTML = "Erro ao Registrar"
        modalTitulo.className += "modal-title text-danger"
        modalConteudo.innerHTML = "Existem campos obrigatórios não preenchidos!"
        modalButton.className += "btn btn-danger"
        modalButton.innerHTML = "Voltar"

    }
    //Selecionando elemento com JQuery e exibindo modal erro
}

async function carregaListaDespesas(despesas = Array(), filtro = false) {

    var tabelaDespesas = document.getElementById("tabelaDespesas")
    tabelaDespesas.innerHTML = ''

    if (despesas.length == 0 && filtro == false) {
        despesas = await bd.recuperarTodosRegistros()

    } else if (despesas.length == 0 && filtro == true) {
        let linha = tabelaDespesas.insertRow()
        linha.insertCell(0).innerHTML = 'Nenhum registro encontrado!'
        linha.insertCell(1)
        linha.insertCell(2)
        linha.insertCell(3)
        linha.insertCell(4)
        linha.insertCell(5)
    }


    //Percorre o array de despesas para criar as rows na tabela
    despesas.forEach(function (d) {

        //Criando row (tr)
        let linha = tabelaDespesas.insertRow()

        linha.insertCell(0).innerHTML = d.iddespesa
        //Criando colunas na row criada (td)
        linha.insertCell(1).innerHTML = `${d.datA_DESP.getDate().toString().padStart(2, "0")}/${(d.datA_DESP.getMonth() + 1).toString().padStart(2, "0")}/${d.datA_DESP.getFullYear()}`

        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Faculdade'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Aluguel'
                break
            case '6': d.tipo = 'Cartão de Crédito'
                break
            case '7': d.tipo = 'Contas Fixas'
                break
        }

        linha.insertCell(2).innerHTML = d.tipo
        linha.insertCell(3).innerHTML = d.descricao
        //linha.insertCell(3).innerHTML = d.valor.toFixed(2).toString().replace('.',',');
        linha.insertCell(4).innerHTML = d.valor.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })

        //Criar botao de Edição
        let btnEditar = document.createElement("button")
        btnEditar.className = 'btn btn-success btn-sm'
        btnEditar.innerHTML = '<i class="fa fa-edit"></i>'
        btnEditar.id = d.iddespesa
        btnEditar.onclick = function () {
            editar(d)
        }

        //Criar botao de Exclusao
        let btnExcluir = document.createElement("button")
        btnExcluir.className = 'btn btn-danger btn-sm btn-excluir'
        btnExcluir.innerHTML = '<i class="fas fa-times" style="width:15px"></i>'
        btnExcluir.id = d.iddespesa
        btnExcluir.onclick = function () {
            remover(d.iddespesa)
        }


        linha.insertCell(5).append(btnEditar)
        linha.insertCell(6).append(btnExcluir)
    })
}

async function filtroPesquisa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesasFiltradas = await bd.pesquisar(despesa)

    carregaListaDespesas(despesasFiltradas, true)
}

function remover(id) {
    //Cria modal para confirmar exclusao
    let modalTitulo = document.getElementById("modalRemoverTitulo")
    let modalConteudo = document.getElementById("modalRemoverConteudo")
    let modalButtonRemover = document.getElementById("btnRemover")

    modalTitulo.innerHTML = "Remoção de Despesa"
    modalTitulo.className += "modal-title text-danger"
    modalConteudo.innerHTML = "Deseja confirmar a exclusão da despesa?"
    modalButtonRemover.className += "btn btn-danger"

    $("#modalRemoverDespesa").modal("show")

    //Se usuario clicar em Remover na modal chama funcao bd.removerDespesa passando id recebido
    modalButtonRemover.onclick = async function () {
        if(bd.removerDespesa(id)){
            window.location.reload()
        }
        
    }
}

function parseData(response) {
    response.forEach(function (r) {
        r['datA_DESP'] = new Date(Date.parse(r['datA_DESP']))
    })

    return response
}

async function editar(d) {
    let ano = document.getElementById("ano")
    let mes = document.getElementById("mes")
    let dia = document.getElementById("dia")
    let tipo = document.getElementById("tipo")
    let descricao = document.getElementById("descricao")
    let valor = document.getElementById("valor")
    let titulo = document.getElementById("titulo-pagina")
    let botaoPesquisar = document.getElementById("botao-pesquisar")
    let iconeBotaoPesquisar = document.getElementById("icone-pesquisar")
    var tabelaDespesas = document.getElementById("tabelaDespesas")

    //Preenchendo filtros com valores do item selecionado
    dia.value = d.datA_DESP.getDate()
    mes.value = d.datA_DESP.getMonth() + 1
    ano.value = d.datA_DESP.getFullYear()

    switch (d.tipo) {
        case 'Alimentação': d.tipo = 1
            break
        case 'Faculdade': d.tipo = 2
            break
        case 'Lazer': d.tipo = 3
            break
        case 'Saúde': d.tipo = 4
            break
        case 'Aluguel': d.tipo = 5
            break
        case 'Cartão de Crédito': d.tipo = 6
            break
        case 'Contas Fixas': d.tipo = 7
            break
    }

    tipo.value = d.tipo
    descricao.value = d.descricao
    valor.value = d.valor.toFixed(2)

    titulo.innerHTML = "Editar Despesa"

    //Alterando botao de pesquisa para botao de editar
    botaoPesquisar.style.backgroundColor = 'green'
    botaoPesquisar.style.borderColor = 'green'
    iconeBotaoPesquisar.remove()
    var iconeEditar = document.createElement('span')
    iconeEditar.className = 'fas fa-edit'
    botaoPesquisar.appendChild(iconeEditar)

    //Limpando tabela para exibir somente item selecionado
    tabelaDespesas.innerHTML = ''

    //Criando row (tr)
    let linha = tabelaDespesas.insertRow()

    //Exibindo somente item selecionado na tabela
    linha.insertCell(0).innerHTML = d.iddespesa
    linha.insertCell(1).innerHTML = `${d.datA_DESP.getDate().toString().padStart(2, "0")}/${(d.datA_DESP.getMonth() + 1).toString().padStart(2, "0")}/${d.datA_DESP.getFullYear()}`
    switch (d.tipo) {
        case 1: d.tipo = 'Alimentação'
            break
        case 2: d.tipo = 'Faculdade'
            break
        case 3: d.tipo = 'Lazer'
            break
        case 4: d.tipo = 'Saúde'
            break
        case 5: d.tipo = 'Aluguel'
            break
        case 6: d.tipo = 'Cartão de Crédito'
            break
        case 7: d.tipo = 'Contas Fixas'
            break
    }

    linha.insertCell(2).innerHTML = d.tipo
    linha.insertCell(3).innerHTML = d.descricao
    linha.insertCell(4).innerHTML = d.valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    linha.insertCell(5)
    linha.insertCell(6)

    botaoPesquisar.removeAttribute("onclick")
    botaoPesquisar.onclick = async function () {
        let despesa = new Despesa(
            ano.value,
            mes.value,
            dia.value,
            tipo.value,
            descricao.value,
            valor.value
        )
        if (despesa.validarDados()) {
            let modalTitulo = document.getElementById("modalRemoverTitulo")
            let modalConteudo = document.getElementById("modalRemoverConteudo")
            let modalButtonRemover = document.getElementById("btnRemover")

            modalTitulo.innerHTML = "Edição de Despesa"
            modalTitulo.className += "modal-title text-success"
            modalConteudo.innerHTML = "Deseja confirmar as alterações na despesa?"
            modalButtonRemover.innerHTML = "Confirmar"
            modalButtonRemover.className += "btn btn-success"

            $("#modalRemoverDespesa").modal("show")

            //Se usuario clicar em Remover na modal chama funcao bd.removerDespesa passando id recebido
            modalButtonRemover.onclick = async function () {
                await bd.editarDespesa(d.iddespesa, despesa)
                window.location.reload()
            }

        }

    }


}
