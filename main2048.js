var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
	prepareForMobile();//程序运行在移动设备端的准备工作
   newgame();
});


function prepareForMobile(){

    if( documentWidth > 500 ){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    $('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}

function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

//初始化棋盘格
function init(){
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){

            var gridCell = $('#grid-cell-'+i+"-"+j);
            gridCell.css('top', getPosTop( i , j ) );
            gridCell.css('left', getPosLeft( i , j ) );
        }
		//将一维数组转换维二维数组
		for( var i = 0 ; i < 4 ; i ++ ){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for( var j = 0 ; j < 4 ; j ++ ){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    updateBoardView();
    score = 0;
}



function updateBoardView(){

    $(".number-cell").remove();//如果游戏里有里number-cell的元素，则删除
	 for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
            $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            var theNumberCell = $('#number-cell-'+i+'-'+j);

			//为0的数字不显示在页面上
			if( board[i][j] == 0 ){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2 );
                theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2 );
            }
			 else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
				 //每个数字的不同会导致背景颜色不同
				 theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
				//每个数字不同会导致文字的前景色也不同
				 theNumberCell.css('color',getNumberColor( board[i][j] ) );
				//数字的值
				theNumberCell.text( board[i][j] );
            }
			  hasConflicted[i][j] = false;
		 }

    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');
}
function generateOneNumber(){
	//判断当前的棋盘格里是否还有空间来生成一个新的数字
	//nospace函数放在support2048里
	if( nospace( board ) )
        return false;

    //随机一个位置
    var randx = parseInt( Math.floor( Math.random()  * 4 ) );
    var randy = parseInt( Math.floor( Math.random()  * 4 ) );

    var times = 0;
		//判断这个位置是否有数字
		while( times < 50 ){
        if( board[randx][randy] == 0 )
            break;

        randx = parseInt( Math.floor( Math.random()  * 4 ) );
        randy = parseInt( Math.floor( Math.random()  * 4 ) );

        times ++;
    }
	//如果计算机50次随机都没有生成一个位置，则人工生成
	if( times == 50 ){
        for( var i = 0 ; i < 4 ; i ++ )
            for( var j = 0 ; j < 4 ; j ++ ){
                if( board[i][j] == 0 ){
                    randx = i;
                    randy = j;
                }
            }
    }
		//随机一个数字,生成2和4的概率都是0.5
		var randNumber = Math.random() < 0.5 ? 2 : 4;

		//在随机位置显示随机数字
		board[randx][randy] = randNumber;
		//前端为随机数的产生的 动画效果
		 showNumberWithAnimation( randx , randy , randNumber );
		return true;
}

//玩家按下一个按键的事件
$(document).keydown( function( event ){
    event.preventDefault();
    switch( event.keyCode ){
        case 37: //left
		event.preventDefault();//阻挡默认效果（PC放大时会有滚动条出现）
            if( moveLeft() ){//判断是否可以左移
			setTimeout("generateOneNumber()",210);//产生随机数
			setTimeout("isgameover()",300);
            }
		break;
		case 38://up
		if( moveUp() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
		break;
		
		case 39://right
		if( moveRight() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
		break;
		
		case 40://down
		if( moveDown() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
		break;
		default:
		break;
	}
});

//添加触控事件监听器,默认一个手指触控
document.addEventListener('touchstart',function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchend',function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;
	
	//当用户只是点击一下屏幕时。设置为不是滑动
	if( Math.abs( deltax ) < 0.3*documentWidth && Math.abs( deltay ) < 0.3*documentWidth )
        return;

    if( Math.abs( deltax ) >= Math.abs( deltay ) ){

        if( deltax > 0 ){
            //move right
            if( moveRight() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
        else{
            //move left
            if( moveLeft() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
    else{
        if( deltay > 0 ){
            //move down
            if( moveDown() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
        else{
            //move up
            if( moveUp() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
});

//游戏结束
function isgameover(){
	//无空间时有时候也可以移动
	if( nospace( board ) && nomove( board ) ){
        gameover();
    }
}

function gameover(){
    alert('gameover!');
}


function moveLeft(){
	//判断是否可以往左移动
	if( !canMoveLeft( board ) )
        return false;
	
	//具体的移动操作
	for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 1 ; j < 4 ; j ++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < j ; k ++ ){
					//如果左边的一个格为0并且无障碍物
					if( board[i][k] == 0 && noBlockHorizontal( i , k , j , board ) ){
						//move
						//动画从i,j位置移动到i,k
						showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
					//如果左边的一个格与此时的格数字相同并且中间无障碍物
					 else if( board[i][k] == board[i][j] && noBlockHorizontal( i , k , j , board ) && !hasConflicted[i][k] ){
                        //move
						//move
						showMoveAnimation( i , j , i , k );
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
						//通知前台改变分数
						updateScore( score );
						 updateScore( score );

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){

	//判断是否可以往上移动
	if( !canMoveUp( board ) )
        return false;
	
	//具体的移动操作
	for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < i ; k ++ ){
					//如果上边的一个格为0并且无障碍物
					if( board[k][j] == 0 && noBlockVertical( j , k , i , board ) ){
						//move
						showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
					//如果左边的一个格与此时的格数字相同并且中间无障碍物
					else if( board[k][j] == board[i][j] && noBlockVertical( j , k , i , board ) && !hasConflicted[k][j] ){
                        //move
                        showMoveAnimation( i , j , k , j );
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
						//通知前台改变分数
						updateScore( score );

                        hasConflicted[k][j] = true;
                        continue;
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){
	//判断是否可以往右移动
    if( !canMoveRight( board ) )
        return false;
	//具体的移动操作
	 for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2 ; j >= 0 ; j -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > j ; k -- ){
					//如果左边的一个格为0并且无障碍物
					if( board[i][k] == 0 && noBlockHorizontal( i , j , k , board ) ){
						//move
						//动画从i,j位置移动到i,k
						showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
					//如果左边的一个格与此时的格数字相同并且中间无障碍物
					 else if( board[i][k] == board[i][j] && noBlockHorizontal( i , j , k , board ) && !hasConflicted[i][k] ){
                       //move
                        showMoveAnimation( i , j , i , k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore( score );

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
	//判断是否可以往下移动
	if( !canMoveDown( board ) )
        return false;
	
	//具体的移动操作
	for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > i ; k -- ){
					//如果左边的一个格为0并且无障碍物
					if( board[k][j] == 0 && noBlockVertical( j , i , k , board ) ){
						//move
						//动画从i,j位置移动到i,k
						 showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
					//如果左边的一个格与此时的格数字相同并且中间无障碍物
					else if( board[k][j] == board[i][j] && noBlockVertical( j , i , k , board ) && !hasConflicted[k][j] ){
                        //move
                        showMoveAnimation( i , j , k , j );
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
						//通知前台改变分数
						updateScore( score );

                        hasConflicted[k][j] = true;
                        continue;
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);
    return true;
}