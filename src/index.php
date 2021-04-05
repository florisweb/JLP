<!-- https://github.com/darren-lester/nihongo -->
<!-- https://wanakana.com/docs/global.html#bind -->
<style>
	#inputField {
		font-size: 20px;

	}
</style>
<script src='wanakana.js'></script>
<input id='inputField' lang='ja' inputmode='numeric'>
<script> 

	let input = inputField;
	wanakana.bind(input, {IMEMode: 'toHiragana' || 'toKatakana'	});



</script>