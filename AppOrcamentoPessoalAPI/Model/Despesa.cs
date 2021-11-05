using System;

namespace AppOrcamentoPessoalAPI.Model
{
    public class Despesa
    {
        public int IDDESPESA { get; set; }
        public DateTime DATA_DESP { get; set; }
        public string Tipo { get; set; }
        public string Descricao { get; set; }
        public float Valor { get; set; }

        public Despesa(){ }
        public Despesa(int id, DateTime data, string tipo, string descricao, float valor){
            IDDESPESA = id;
            DATA_DESP = data;
            Tipo = tipo;
            Descricao = descricao;
            Valor = valor;
        }

    }

}