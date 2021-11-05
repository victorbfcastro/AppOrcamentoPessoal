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

    gravar(despesa) {
        //Chama funcao que identifica ultimo ID e acrescenta 1
        let id = this.getProximoId()

        //Para registrar algo no Local Storage do browser é necessário que o objeto seja representado em formato JSON como abaixo
        localStorage.setItem(id, JSON.stringify(despesa))

        localStorage.setItem('id', id)

    }

    async recuperarTodosRegistros() {
        //Array de despesas
        let despesas = Array()

        var response = ''
        const request = await fetch('http://localhost:5000/api/Despesas')
            .then(T => T.json())
            .then(data => response = data)

        var responseFinal = parseData(response)
        
        responseFinal.forEach(function(d){
            despesas.push(d)
        })

        // let id = localStorage.getItem('id')

        // //Recuperando todas as despesas cadastradas em LocalStorage
        // for (let i = 1; i <= id; i++) {
        //     let despesa = JSON.parse(localStorage.getItem(i))

        //     //Caso a despesa recuperada esteja nula, continua para o proximo laço sem adicionar ao Array
        //     if (despesa === null) {
        //         continue
        //     }

        //     //seta um id para cada item
        //     despesa.id = i
        //     despesas.push(despesa)
        // }

        return despesas
    }

    pesquisar(despesa) {
        /*Recebendo uma despesa pra fazer a pesquisa e filtrar resultado
            Para utilizar o filter do Array:
            
            >> meuarray.filter(function(f) { return minha_primeira_condicao }).filter(function(f) { return minha_segunda_condicao }) etc
            
            podendo ser reduzido a uma arrow function:

            >> meuarray.filter(f => minha_primeira_condicao).filter(f => minha_segunda_condicao)
        */

        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()

        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(f => f.dia == despesa.dia)
        }

        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(f => f.mes == despesa.mes)
        }

        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(f => f.ano == despesa.ano)
        }

        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(f => f.tipo == despesa.tipo)
        }

        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(f => f.descricao == despesa.descricao)
        }

        if (despesa.valor != '' && despesa.valor !== undefined) {
            despesasFiltradas = despesasFiltradas.filter(f => f.valor == despesa.valor)
        }

        return despesasFiltradas

    }

    removerDespesa(id) {
        localStorage.removeItem(id)
    }
}

let bd = new BD()

function cadastrarDespesa() {

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

        bd.gravar(despesa)

        //Limpando campos após registro com sucesso
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

        exibeModal(true)

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

    if (despesas.length == 0 && filtro == false) {
        despesas = await bd.recuperarTodosRegistros()
    }

    var tabelaDespesas = document.getElementById("tabelaDespesas")
    tabelaDespesas.innerHTML = ''

    //Percorre o array de despesas para criar as rows na tabela
    despesas.forEach(function (d) {

        //Criando row (tr)
        let linha = tabelaDespesas.insertRow()

        //Criando colunas na row criada (td)
        linha.insertCell(0).innerHTML = `${d.datA_DESP.getDate()}/${d.datA_DESP.getMonth() + 1}/${d.datA_DESP.getFullYear()}`

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

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        //linha.insertCell(3).innerHTML = d.valor.toFixed(2).toString().replace('.',',');
        linha.insertCell(3).innerHTML = d.valor.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })

          //Criar botao de Edição
          let btnEditar = document.createElement("button")
          btnEditar.className = 'btn btn-success btn-sm'
          btnEditar.innerHTML = '<i class="fa fa-edit"></i>'
          btnEditar.id = `id_despesa_${d.id}`
          btnEditar.onclick = function () {
              remover(d.id)
          }

        //Criar botao de Exclusao
        let btnExcluir = document.createElement("button")
        btnExcluir.className = 'btn btn-danger btn-sm btn-excluir'
        btnExcluir.innerHTML = '<i class="fas fa-times" style="width:15px"></i>'
        btnExcluir.id = `id_despesa_${d.id}`
        btnExcluir.onclick = function () {
            remover(d.id)
        }


        linha.insertCell(4).append(btnEditar)
        linha.insertCell(5).append(btnExcluir)
    })
}

function filtroPesquisa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, descricao, valor)

    let despesasFiltradas = bd.pesquisar(despesa)

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
    modalButtonRemover.onclick = function () {
        bd.removerDespesa(id)
        window.location.reload()
    }
}

function parseData(response) {
    response.forEach(function (r) {
        r['datA_DESP'] = new Date(Date.parse(r['datA_DESP']))    
    })

    return response
}
