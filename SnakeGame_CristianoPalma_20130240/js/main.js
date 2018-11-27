//Variáveis Globais
var colors = ['#FF4500', '#FF8C00', '#7FFF00', '#00BFFF', '#9932CC'];
var color = { 'snake': '', 'food': ''};
var milliseconds = 50; 
var speed = 50; //velocidade inicial do jogo
var size = 10;

//Verificar se o browser suporta a canvas tag
function support(){
    canvas = document.getElementById('base');
    context = canvas.getContext('2d');
    start();
};

//Inicia o jogo e as variáveis
function start(){
    snake = [];
    length = 5; //tamanho inicial da cobra
    currentPoint = { 'x': 250, 'y': 250 }; //coordenadas iniciais
    direction = ''; //direccao inicial da cobra se preferir
    point = [];
    context.clearRect(0, 0, canvas.width, canvas.height);
   
    color ['snake'] = '#000000'; // cor inicial da cobra: preto

    setFoodEaten(); //A comida que é comida 
    drawSnake(); //Desenha a cobra
    drawFood();//Desenha a comida

    timer = setInterval(function(){
        move(direction) 
    }, milliseconds);

    isPaused = false;

    setStatus('Iniciado, pode pausar o jogo ao carregar na tecla Espaço.');
};

    //SetFoodEaten valor no html
    function setFoodEaten(){
        document.getElementById('foodEaten').innerText = length - 5;
    };
    
    // SetSpeed no html
    function setSpeed(){
        clearInterval(timer);

        timer = setInterval(function(){
            move(direction)
        }, milliseconds);
        document.getElementById('milliseconds').innerText = speed;
    };

    //Setstatus no html
    function setStatus(status){
        document.getElementById('status').innerText = status;
    };

    //Desenha a cobra
    function drawSnake(){
        if(snake.some(eaten)){
            end();
            return 0;
        }

        snake.push([currentPoint['x'], currentPoint['y']]);

        context.fillStyle = color['snake'];

        context.fillRect(currentPoint['x'], currentPoint['y'], size, size);

        if (snake.length > length){
            body = snake.shift();

            context.clearRect(body[0], body[1], size, size);
        }

        //Muda a cor da cobra ao comer e cria outra comida
        if(currentPoint['x'] == point['x'] && currentPoint['y'] == point['y']){
            color['snake'] = color['food'];

            length++;
            setFoodEaten();
            drawFood();
        }
    };

    //Verifica se a cobra se come a ela propria
    function eaten(snake){
            return (snake[0] == currentPoint['x'] && snake[1] == currentPoint['y']);
    };

    //Desenha a comida
    function drawFood(){   
        point = { 'x': Math.floor(Math.random()* (canvas.width / size)) * size,
                  'y': Math.floor(Math.random()* (canvas.height / size)) * size }; 
    
        if(snake.some(pointer))
            drawFood();
        else {
                color['food'] = colors[Math.floor(Math.random() * colors.length)];
                context.fillStyle = color['food'];

                context.fillRect(point['x'], point['y'], size, size);
        }
    };

    //Verifica e compara a posicao da cobra e da comida
    function pointer(_snake){
        return (_snake[0] == point['x'] && _snake[1] == point['y']);
    };

    //keydown event
    document.onkeydown = function(event){
    
        //get keycode
        var keyCode = window.event.keyCode;
        
    
        //Esc key para reiniciar o jogo
        if (keyCode == 27){
            clearInterval(timer);
            isPaused = true;
            start();
        }

        //Espaço para pausar o jogo
        else if (keyCode == 32){
            //para continuar o jogo
            if (isPaused){
                timer = setInterval(function(){ move(direction)}, milliseconds);
                isPaused = false;
                setStatus('Iniciado, pode pausar o jogo ao carregar na tecla Espaço. ');
            }
            //para pausar o jogo
            else{
                clearInterval(timer)
                isPaused = true;
                setStatus('Pausado, pode continuar o jogo ao carregar na tecla Espaço. ');
            }
        }
        // + para aumentar a velocidade da cobra
        else if (keyCode == 187 && !isPaused ){
            //para continuar o jogo
            milliseconds -= 5;
            speed += 5;
            setSpeed();
        }
        // - para diminuir a velocidade da cobra
        else if (keyCode == 189 && !isPaused ){
            //para continuar o jogo
            milliseconds += 5;
            speed -= 5;
            setSpeed();
        }

        // tecla A ou seta Esquerda para mover a cobra
        else if (keyCode == 65 || keyCode == 37 ) {
            if (direction != 'right' && !isPaused)
            move('left');
        }

        //tecla W ou seta Cima para mover a cobra
        else if(keyCode == 87 || keyCode == 38 ) {
            if(direction != 'down' && !isPaused)
            move('up');
        }

        //tecla D ou seta Direita para mover a cobra
        else if(keyCode == 68 || keyCode == 39 ) {
            if(direction != 'left' && !isPaused)
            move('right');
        }
        //tecla S ou seta Baixo para mover a cobra
        else if(keyCode == 83 || keyCode == 40 ) {
            if(direction != 'up' && !isPaused)
            move('down');
        }
    };

    //movimenta a cobra com a direcao recebida
    function move(direction){
        if(direction == 'left'){
            if(position(direction) >= 0)
            execute(direction, 'x', position(direction));
            else    
                end();
        }
        else if(direction == 'up'){
            if(position(direction) >= 0)
            execute(direction, 'y', position(direction));
            else    
            end();
        }
        else if(direction == 'right'){
            if(position(direction) < canvas.width)
            execute(direction, 'x', position(direction));
            else    
            end();
        }
        else if(direction == 'down'){
            if(position(direction) < canvas.height)
            execute(direction, 'y', position(direction));
            else    
            end();
        }
    };

    //Retorna a nova posicao pela direcao
    function position(direction){
        if(direction == 'left')
            newPosition = currentPoint['x'] - size;
        else if(direction == 'up')
            newPosition = currentPoint['y'] - size;
        else if(direction == 'right')
            newPosition = currentPoint['x'] + size;
        else if(direction == 'down')
            newPosition = currentPoint['y'] + size;

            return newPosition;
    };

    //Executa o movimento
    function execute(direction, axis, value){
        this.direction = direction;
        currentPoint[axis] = value;
        drawSnake();
    };

    //termina o jogo
    function end(){
        clearInterval(timer);
        isPaused = true;
        setStatus('Game Over.');
    };

