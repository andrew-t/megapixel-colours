var inputs =
	'red green blue'
		.split(' ')
		.map(function(name) {
			return document
				.getElementById(name);
		}),
	gamma = 0.45,
	oldMax = 100;

inputs.forEach(function(el) {
	el.addEventListener('change', updateSwatch);
});
document
	.getElementById('mode')
	.addEventListener('change', function(e) {
		var max = parseInt(
					document
						.getElementById('mode')
						.value
						.substr(1));
		if (max != oldMax)
			inputs.forEach(function(el) {
				el.value = Math.round(el.value * max / oldMax);
			});
		updateSwatch(e);
	});

updateSwatch();

function updateSwatch(e) {
	if (e)
		e.preventDefault();
	var rgb = inputs
			.map(function(el) {
				return el.value;
			}),
		colour = [0, 0, 0],
		mode = document
			.getElementById('mode')
			.value,
		max = parseInt(mode.substr(1));
	oldMax = max;
	inputs.forEach(function(el) {
		el.maximum = max;
		el.minimum = 0;
		if (el.value > max)
			el.value = max;
		if (el.value < 0)
			el.value = 0;
	});
	var matrix = (mode[0] == 'e')
		? 'f43353,0aa453,0d6ae9'
			.split(',')
			.map(function(col) {
				return [ 0, 1, 2 ]
					.map(function(i) {
						return Math.pow(
								parseInt(
									col.substr(i * 2, 2),
									16) / 256,
								1 / gamma)
							* 256 / max;
					});
			})
		: [ [ 1, 0, 0 ],
			[ 0, 1, 0 ],
			[ 0, 0, 1 ]]
				.map(function(row) {
					return row
						.map(function(v) {
							return v * 256 / max;
						});
				});
	for (var x = 0; x < 3; ++x)
		for (var y = 0; y < 3; ++y)
			colour[x] += rgb[y] * matrix[y][x];
	if (mode[0] != 'g')
		colour = colour
			.map(function(v) {
				return Math.pow(v / 255, gamma) * 255;
			});
	console.log(colour);
	document
		.getElementById('swatch')
		.style
		.backgroundColor =
			'rgb(' +
			colour
				.map(function(val) {
					return (val > 256)
						? 256
						: ((val < 0)
							? 0
							: Math.round(val));
				})
				.join(', ') +
			')';
}
