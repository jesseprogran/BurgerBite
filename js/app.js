$(document).ready(function () {
    cardapio.eventos.init();
});

let cardapio = {};
let MEU_CARRINHO = [];

cardapio.eventos = {


    init: () => {
        cardapio.metodos.obterItensCardapio()
    }


};

cardapio.metodos = {



    // obtendo lista de itens do cardápio

    obterItensCardapio: (categoria = 'burgers', vermais = false) => {

        let filtro = MENU[categoria];

        if(!vermais) {
             $("#itensCardapio").html('')
             $("#btnVerMais").removeClass('hidden');
        }

       
       
        $.each(filtro, (i, e) => {
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img).
            replace(/\${name}/g, e.name).replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
           . replace(/\${id}/g, e.id)

            //botão ver mais foi clicado (12 itens)
            if(vermais && i >= 8 && i < 12) {    
                $("#itensCardapio").append(temp)
            }

            // paginação inicial (8 itens)

            if(!vermais && i < 8) {
                $("#itensCardapio").append(temp)
            }


        })

        //remove o ativo
        $(".container-menu a").removeClass('active');

        //seta o menu para ativo
        $("#menu-" + categoria).addClass('active')

    },

    // clique no botão de ver mais
    verMais: () => {
        
        let ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio( ativo, true);

        $("#btnVerMais").addClass('hidden');

    },

    // diminuir quantidade do cardápio
    diminuirQuantidade: (id) => {


        let qntAtual = parseInt($("#qntd-" + id).text());

        if (qntAtual > 0) {
            $("#qntd-" + id).text(qntAtual - 1)
        }


    },

    // aumentar quantidade do cardápio
    aumentarQuantidade: (id) => {

        let qntAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntAtual + 1)

    },

    // adcionando itens ao carrinho do cardápio
    adicionarAoCarrinho: (id) => {
        
        let qntAtual = parseInt($("#qntd-" + id).text());

        if (qntAtual > 0) {
            // obter a categoria ativa
            let categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            // obter a lista dos itens
            let filtro = MENU[categoria];

            //obter o item
            let item = $.grep(filtro, (e, i) => { return e.id == id });

            if (item.length > 0) {

                //validar se já existe esse item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });

                // caso já exista o item no carrinho, só altera a quantidade
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id ));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntAtual;
                }

                // caso ainda não exista o item no carrinho, adciona ele
                else {    
                    item[0].qntd = qntAtual;
                    MEU_CARRINHO.push(item[0])
                }

                cardapio.metodos.mensagem('Item adicionado com sucesso', 'green')

                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgeTotal();

            }
        }


    },

    // atualiza o badge de totais dos botões do Meu carrinho
    atualizarBadgeTotal: () => {

        let total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }
        else {
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);

    },

    // abrir modal carrinho
    abrirCarrinho: (abrir) => {

        if (abrir) {
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho();
        }
        else {
            $("#modalCarrinho").addClass('hidden');
        }


    },


    // altera os texto e exibe os botões das etapas
    carregarEtapa: (etapa) => {
        if (etapa == 1) {
            $("#lblTituloEtapa").text('Seu carrinho:');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');
        }

        if (etapa == 2) {

            $("#lblTituloEtapa").text('Endereço de entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');
            
        }

        if (etapa == 3) {

            $("#lblTituloEtapa").text('Resumo do pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');


            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');
            
        }
    },

    // botão de voltar etapa
    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1)

    },


    // carrega a lista de itens do carrinho
    carregarCarrinho: () => {

        cardapio.metodos.carregarEtapa(1);

        if (MEU_CARRINHO.length > 0) {

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) => {

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img).
                replace(/\${name}/g, e.name).replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
               .replace(/\${id}/g, e.id).replace(/\${qntd}/g, e.qntd)

               $("#itensCarrinho").append(temp);

            })

        }
        else {

        }

    },


    diminuirQuantidadeCarrinho: (id) => {

    },
    

    aumentarQuantidadeCarrinho: (id) => {

    },

    removerItemCarrinho: (id) => {

    },











    // mensagens
    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`

        $("#container-mensagens").append(msg);

        setTimeout(() => {

            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800)
        }, tempo)
    },




};

cardapio.templates = {

    item: `
    
        <div class="col-3 mb-5" id="\${id}">
            <div class="card card-item">
                <div class="img-produto">
                    <img src="\${img}" alt="">
                </div>

                <p class="title-produto text-center mt-4 ">
                    <b>\${name}</b>
                </p>

                <p class="price-produto text-center">
                    <b>R$ \${price}</b>
                </p>

                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `,

    itemCarrinho: `
      
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}" alt="">
            </div>

            <div class="dados-produto">
                <p class="title-produto"><b>\${name}</b></p>
                <p class="price-produto"><b>R$ \${price}</b></p>
            </div>

            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fas fa-times"></i></span>
            </div>
        </div>

    `
};