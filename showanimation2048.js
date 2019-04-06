function showNumberWithAnimation( i , j , randNumber ){
	
	//通过id来取得响应的元素
	 var numberCell = $('#number-cell-' + i + "-" + j );
	
	//由于数字的改变，样式就会发生改变
	numberCell.css('background-color',getNumberBackgroundColor( randNumber ) );
    numberCell.css('color',getNumberColor( randNumber ) );
    numberCell.text( randNumber );

	
	//使用jquere的animate属性完成动画效果
	numberCell.animate({
        width:cellSideLength,
        height:cellSideLength,
        top:getPosTop( i , j ),
        left:getPosLeft( i , j )
    },50);
}

//移动数字时改变的样式
function showMoveAnimation( fromx , fromy , tox, toy ){

    var numberCell = $('#number-cell-' + fromx + '-' + fromy );
    numberCell.animate({
        top:getPosTop( tox , toy ),
        left:getPosLeft( tox , toy )
    },200);
}

function updateScore( score ){
    $('#score').text( score );
}