class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    //método que valida se todos os dados foram preenchidos e retorna true ou false
    validarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }
        return true
    }
}

class BD {
    //No construtor iremos verificar se existe um ID no localStorage e caso negativo, registraremos o Id zero.
    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        //Identifica ultimo valor de ID e incrementa 1 para retornar
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(despesa){
        //Chama funcao que identifica ultimo ID e acrescenta 1
        let id = this.getProximoId()
        
        //Para registrar algo no Local Storage do browser é necessário que o objeto seja representado em formato JSON como abaixo
        localStorage.setItem(id, JSON.stringify(despesa))
        
    }
}

let bd = new BD()

function cadastrarDespesa(){
    
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
    
    if(despesa.validarDados()){
        bd.gravar(despesa)
        console.log("Dados válidos")

    }else{
        console.log("Dados inválidos")
    }
}