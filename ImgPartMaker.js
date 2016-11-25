/**
 * ImgPartMaker
 * 
 * @note
 * Make Part Image.
 * 
 * @version 0.1
 * @date 2016-11-25
 * 
 * @param option
 */

var ImgPartMaker =function(option){
	
	
	this.option = option;
	
	this.canvas; // canvas elements.
	
	this.ctx; // A canvas context object for 2d.
	
	this.bgImg;// The Image object for back image.
	
	this.partImg;// The Image object for part image.
	
	this.partEnt = {}; // A part image entity;
	
	var myself=this; // Instance of myself.

	/**
	 * initialized.
	 */
	this.constract=function(){
		
		// If Option property is empty, set a value.
		this.option = setOptionIfEmpty(this.option);
		
		
		var canvas = document.getElementById('canvas1');
		
		// キャンバスサイズをオプションにセット
		this.option.canvas_width = canvas.width;
		this.option.canvas_height = canvas.height;

		
		// Unsupported check.
		if ( ! canvas || ! canvas.getContext ) {
			return false;
		}
		
		// create a context object.
		var ctx = canvas.getContext('2d');
		
		
		//背景画像ファイルアップロードイベント
		$('#bg_file').change(function(e) {
			bgFileUpload(e);
		});
		
		
		//パーツ画像ファイルアップロードイベント
		$('#part_file').change(function(e) {
			partFileUpload(e);
		});
		
		this.canvas = canvas;
		this.ctx = ctx;
		
	};
	
	
	/**
	 * refresh canvas.
	 */
	this.refresh = function(){
		

		// clear canvas.
		var canvas_width = myself.option.canvas_width;
		var canvas_height = myself.option.canvas_height;
		myself.ctx.clearRect(0,0,canvas_width,canvas_height);
		
		// Get part entity from elements.
		var partEnt = getPartEntityFormElm();
		
		// Draw the back image to canvas.
		if(myself.bgImg && partEnt.bg_show){
			
			myself.ctx.drawImage(myself.bgImg, 0, 0);
		}

		// Draw the part image to canvas.
		if(myself.partImg){
			myself.ctx.drawImage(myself.partImg, partEnt.px, partEnt.py,partEnt.width,partEnt.height);
		}
		
	}
	
	/**
	 * Download image.
	 */
	this.download = function(fn){

		//var element = $('#canvas1')[0];

        //DOM要素をcanvasに変換する。html2canvas.jsの機能
        html2canvas(myself.canvas, { onrendered: function(canvas) {

			//canvas.toBlob()が実装されていないブラウザに対応。
        	var type = 'image/png';
        	// canvas から DataURL で画像を出力
        	var dataurl = canvas.toDataURL(type);
        	// DataURL のデータ部分を抜き出し、Base64からバイナリに変換
        	var bin = atob(dataurl.split(',')[1]);
        	// 空の Uint8Array ビューを作る
        	var buffer = new Uint8Array(bin.length);
        	// Uint8Array ビューに 1 バイトずつ値を埋める
        	for (var i = 0; i < bin.length; i++) {
        	  buffer[i] = bin.charCodeAt(i);
        	}
        	// Uint8Array ビューのバッファーを抜き出し、それを元に Blob を作る
        	var blob = new Blob([buffer.buffer], {type: type});


        	//★FileSaver.jsによるファイルダウンロード
	  		saveAs(
    	  			  blob,
    	  			fn
    	  		);

	  		/*
    	  	canvas.toBlob(function(blob) {
    	  		saveAs(
    	  			  blob
    	  			, "test.png"
    	  		);
	  		});*/


        }});
		
		
	}
	
	// If Option property is empty, set a value.
	function setOptionIfEmpty(option){
		
		if(option == undefined){
			option = {};
		}
		
		if(option['flg'] == undefined){
			option['flg'] = 0;
		}
		
		return option;
	};
	
	
	/**
	 * 背景画像アップロードイベント
	 * 
	 */
	function bgFileUpload(e){
		//ファイルオブジェクト配列を取得（配列要素数は選択したファイル数を表す）
		var files = e.target.files;
		var oFile = files[0];

		var reader = new FileReader();
		reader.readAsDataURL(oFile); // データURLスキーム取得処理を非同期で開始する
	
		// Excution After getting a data url scheme.
		reader.onload = function(evt) {
			
			myself.bgImg = new Image();
			myself.bgImg.src = reader.result;
			

			// refresh canvas.
			myself.refresh();
		}
	}
	
	
	
	/**
	 * パーツ画像アップロードイベント
	 * 
	 */
	function partFileUpload(e){
		//ファイルオブジェクト配列を取得（配列要素数は選択したファイル数を表す）
		var files = e.target.files;
		var oFile = files[0];

		var reader = new FileReader();
		reader.readAsDataURL(oFile); // データURLスキーム取得処理を非同期で開始する
	
		// Excution After getting a data url scheme.
		reader.onload = function(evt) {
			
			myself.partImg = new Image();
			myself.partImg.src = reader.result;
			
			myself.partEnt['orig_width'] = myself.partImg.width;
			myself.partEnt['orig_height'] = myself.partImg.height;

			// refresh canvas.
			myself.refresh();
		}
	}


	
	// Get part entity from elements.
	function getPartEntityFormElm(){
		
		var ent = myself.partEnt;
		
		// Get a show flg from checkbox.
		if($('#bg_show_check').prop('checked')){
			ent['bg_show'] = 1;
		}else{
			ent['bg_show'] = 0;
		}
		
		// Get position from the input element.
		ent['px'] = $('#part_px').val();
		ent['py'] = $('#part_py').val();
		
		
		// Calc width and height from the input element.
		var rate_sx = $('#part_rate_sx').val();
		ent['width'] = ent['orig_width'] * rate_sx/100
		
		var rate_sy = $('#part_rate_sy').val();
		ent['height'] = ent['orig_height'] * rate_sy/100
		
		
		
		
		return ent;
	}
	
	
	// call constractor method.
	this.constract();
};