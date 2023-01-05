
let moneda = 'dolar'
//let divisa = []

const ctx = document.getElementById('estadisticas');
let grafico = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: '# variable ultimos 10 dias',
            data: [],
            borderWidth: 1
        }]
    },
    options: {
        //scales: {
            //y: {
            //    beginAtZero: true
            //}
        //}
    }
});

const getDivisa = async (moneda) =>{
    const res = await fetch (`https://mindicador.cl/api/${moneda}`)
    divisa = await res.json()
    return divisa;
}

const calcular = async (moneda) => {
    clp = document.querySelector("#input").value
    moneda = document.querySelector("#selec").value
    respuestaDivisa = await getDivisa(moneda);
    valorDivisa = respuestaDivisa.serie[0].valor;
    total = clp / valorDivisa
    document.getElementById('total').textContent = total.toFixed(2)
    obtenerIndicadores(moneda,clp)
    document.getElementById("nombreDivisa").textContent = capitalize(moneda);
    console.log(moneda);

}

const capitalize = (valor) => {
   return valor[0].toUpperCase() + valor.substring(1);
}

async function obtenerIndicadores(moneda, clp){
    let peticion = await fetch("https://mindicador.cl/api")
    let indicadores = await peticion.json()
    let conversion = clp / indicadores [moneda].valor

    let peticionesFechas = await fetch(`https://mindicador.cl/api/${moneda}`)
    let indicadorFechas = await peticionesFechas.json()

    let fechas = indicadorFechas.serie.splice(0,10)

    let labels = []
    let valores = []

    fechas.forEach(element => {
        let fecha = moment(element.fecha).format('DD/MM/YYYY')
        labels.push(fecha)
        valores.push(element.valor)
    });

    grafico.data.labels = labels.reverse()
    grafico.data.datasets[0].data = valores.reverse()
    grafico.update()

    console.log(labels);
}

obtenerIndicadores (moneda, 10000);
