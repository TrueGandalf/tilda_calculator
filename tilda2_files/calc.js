var rastamojka_pmr = {
	10: {
		'fuel': [9.2, 0.45],
		'electro': [4.6, 0.29]
	},
	7: {
		'fuel': [7, 0.4],
		'electro': [4.6, 0.29]
	},
	3: {
		'fuel': [4.6, 0.29],
		'electro': [4.6, 0.29]
	},
	0: {
		'fuel': [2.3, 0.23],
		'electro': [2.3, 0.23]
	}
}

var rastamojka_md = {
	0: {
		'Бензин': [9.56, 12.23, 18.9, 31.14, 55.6],
		'Дизель': [12.23, 31.14, 55.6]
	},
	3: {
		'Бензин': [10, 12.67, 19.34, 31.58, 56.04],
		'Дизель': [12.67, 31.58, 56.04]
	},
	5: {
		'Бензин': [10.23, 12.9, 19.57, 31.81, 56.27],
		'Дизель': [12.9, 31.81, 56.27]
	},
	7: {
		'Бензин': [10.45, 13.12, 19.79, 32.03, 56.49],
		'Дизель': [13.12, 32.03, 56.49]
	},
	8: {
		'Бензин': [11.5, 14.49, 21.62, 35.2, 58.66],
		'Дизель': [14.49, 35.2, 58.66]
	},
	9: {
		'Бензин': [12.19, 15.17, 23.23, 37.03, 58.89],
		'Дизель': [15.17, 37.03, 58.89]
	},
	10: {
		'Бензин': [12.89, 16.33, 24.39, 38.88, 59.13],
		'Дизель': [16.33, 38.88, 59.13]
	}
}

poshlina_per = 0.1;
nds_per = 0.2;

acciz_limits = {
	1: {
		'limit_bens': 3,
		'limit_bens_price': [50, 100],
		'limit_dizel': 3.5,
		'limit_dizel_price': [75, 150]
	},
	2: {
		'limit_bens': 3,
		'limit_bens_price': [50, 100],
		'limit_dizel': 3.5,
		'limit_dizel_price': [75, 150]
	},
	3: {
		'limit_bens': .5,
		'limit_bens_price': [62, 447],
		'limit_dizel': .5,
		'limit_dizel_price': [62, 447]
	}
}

$(document).ready(function(){
	$(".js-calc-push").click(function(e){
		e.preventDefault();
		calc_auto();
	});
	$('.js-calc-car').change(function(){
		$('.js-calc-car-image').attr('src',$('option:selected',this).data('img'));
	});
	$(".js-car-auction, .js-calc-city, .js-calc-avtopmr").change(function(e){
		calc_auto();
	});
	$('.js-car-fuel').change(function(){
		$('.data-toggle-calc').hide();
		if($(this).data('toggle-calc')) $($(this).data('toggle-calc')).show()
	});

	

	function calc_auto () {
		var auto_price = Number($(".js-car-price").val()),
			auto_engine = Number($(".js-car-volume").val()),
			auto_battery = Number($(".js-car-battery").val()),
			auto_type = Number($('.js-calc-car option:selected').data('id')),
			auto_engine_type = $(".js-car-fuel:checked").val(),
			auto_age = Number($('.js-car-age').val()),
			region = $('body').data('region'),
			euro_course = parseFloat($(".js-car-course").val()),
			grn_course = 	parseFloat($(".js-car-course-grn").val()),
			lei_course = parseFloat($(".js-car-course-lei").val()),
			rastamoj = 0,
			insur = auto_price * 0.02,
			park = 50,
			expedir = 750,
			avtopmr = 400,//Number($('.js-calc-avtopmr').val()),
			acciz, poshlina, nds, rastamoj_add, acciz_single, total_price, comission, pension, pension_single,
			ship1, ship2, ship_days, ship_port;
		
		ship1 = parseInt($(".js-calc-city").val()) * ((auto_type == 3) ? .8 : 1);
		ship2 = parseInt($(".js-calc-city option:selected").attr("data-sea")) * ((auto_type == 3) ? .5 : 1);
		ship_days = $(".js-calc-city option:selected").attr("data-days");
		ship_port = $(".js-calc-city option:selected").attr("data-port");

		function calc_acziz_bens(price, capacity, koef){
			var tarif, akciz;

			tarif = (capacity <= acciz_limits[auto_type]['limit_bens']) ? acciz_limits[auto_type]['limit_bens_price'][0]: acciz_limits[auto_type]['limit_bens_price'][1];

			akciz =  tarif * capacity * ((auto_type == 3) ? 1 : auto_age);
			return Math.round(akciz * koef);
		}
		function calc_acziz_dizel(price, capacity, koef){	
			var tarif, akciz;

			tarif = (capacity <= acciz_limits[auto_type]['limit_dizel']) ? acciz_limits[auto_type]['limit_dizel_price'][0]: acciz_limits[auto_type]['limit_dizel_price'][1];

			akciz =  tarif * capacity * ((auto_type == 3) ? 1 : auto_age);
			return Math.round(akciz * koef);
		}

		
		var fares = $(".js-car-auction option:selected").data("fares").split("|");

		fares.forEach(function(element) {
			var fares1 = element.split(":");
			var fares_from = parseInt(fares1[0]);
			var fares_to = parseInt(fares1[1]);
			
			if (auto_price >= fares_from && auto_price < fares_to) {
				comission = parseInt(fares1[2]);

				if (auto_price >= 15000 && $(".js-car-auction").val() == 'copart') 
					comission = Number(auto_price)*0.04 + Number(fares1[2]);

				if (auto_price >= 7500 && $(".js-car-auction").val() == 'iaai') {
					comission = comission +  Number(auto_price) * ((auto_price < 20000) ? 0.01 : 0.04) + 35;
				}
			}
			
		});

		switch(auto_engine_type){
			case "Бензин": acciz = calc_acziz_bens(auto_price, auto_engine, euro_course); break;
			case "Дизель": acciz = calc_acziz_dizel(auto_price, auto_engine, euro_course); break;
			case "Электро": acciz = Math.round(auto_battery * euro_course); break;
			case "Гибрид": acciz = Math.round(100 * euro_course); break;
		}

		console.log(comission);

		poshlina = (auto_engine_type === "Электро") ? 0 : Math.round(poshlina_per * (Number(comission) + 400 + Number(auto_price)));
		nds = (auto_engine_type === "Электро") ? 0 : Math.round((Number(auto_price) + Number(comission) + Number(poshlina) + Number(acciz) + 400) * nds_per);

		if(region !== 'ua') {  // растаможка
			if(region == 'pmr') { //pmr
				switch(true) {
					case(auto_age  < 2): step = 0; break;
					case(auto_age  < 6): step = 3; break;
					case(auto_age  < 9): step = 7; break;
					default: step = 10;
				}
				rastamoj_engine = (auto_engine_type == "Дизель" || auto_engine_type == "Бензин") ? 'fuel' : 'electro';
				rastamoj_per = rastamojka_pmr[step][rastamoj_engine][0];
				rastamoj_kub = rastamojka_pmr[step][rastamoj_engine][1];
				rastamoj_price = parseInt(auto_price);
				price2 = auto_engine * 1000 * rastamoj_kub;
				if(auto_engine_type == "Электро") {
					rastamoj_price += parseInt(comission) + parseInt(ship1) + parseInt(ship2);
					price2 = 0;
				}
				price1 = rastamoj_price * rastamoj_per / 100;
				if(price1 > price2) {
					rastamoj = price1 + 100;
					rastamoj_add = rastamoj_per + '%';
				} else {
					rastamoj = price2 + 100;
					rastamoj_add = rastamoj_kub + '$/см³';
				}
			} else {  // md
				switch(true) {
					case(auto_age  < 2): step = 0; break;
					case(auto_age  < 4): step = 3; break;
					case(auto_age  < 6): step = 5; break;
					case(auto_age  < 7): step = 7; break;
					case(auto_age  < 8): step = 8; break;
					case(auto_age  < 9): step = 9; break;
					default: step = 10;
				}
				rastamoj_engine = auto_engine * 1000;
				if(auto_engine_type == "Дизель") {
					switch(true) {
						case(rastamoj_engine < 1501): rastamoj_kub = rastamojka_md[step]['Дизель'][0]; break;
						case(rastamoj_engine < 2501): rastamoj_kub = rastamojka_md[step]['Дизель'][1]; break;
																 default: rastamoj_kub = rastamojka_md[step]['Дизель'][2]; break;
					}
				} else if (auto_engine_type == "Электро") {
					rastamoj = 0;
				}	else {
					switch(true) {
						case(rastamoj_engine < 1001): rastamoj_kub = rastamojka_md[step]['Бензин'][0]; break;
						case(rastamoj_engine < 1501): rastamoj_kub = rastamojka_md[step]['Бензин'][1]; break;
						case(rastamoj_engine < 2001): rastamoj_kub = rastamojka_md[step]['Бензин'][2]; break;
						case(rastamoj_engine < 3001): rastamoj_kub = rastamojka_md[step]['Бензин'][3]; break;
																 default: rastamoj_kub = rastamojka_md[step]['Бензин'][4]; break;
					}
					rastamoj = rastamoj_kub * lei_course * rastamoj_engine;
					rastamoj_add = (rastamoj_kub * lei_course).toFixed(2) + '$/см³';
					if(auto_engine_type !== 'Бензин') rastamoj = rastamoj * 0.75;
				}
			}
			acciz = 0;
			poshlina = 0;
			nds = 0;
			expedir = 0;
			avtopmr = 0;
		} else {
			rastamoj = acciz + poshlina + nds;
		}

		/* pension block */

		if (auto_price <= (290730/grn_course)) {
			pension_single = 0.03;
		} else if (auto_price <= (510980/grn_course)) {
			pension_single = 0.04;
		} else {
			pension_single = 0.05;
		}
		pension = Math.round((parseInt(auto_price) + parseInt(poshlina) + parseInt(acciz)) * pension_single);	
		
		

		total_price = parseInt(auto_price) + parseInt(acciz) + parseInt(poshlina) + parseInt(nds) + parseInt(region == 'ua' ? 0 : rastamoj) + ship1 + ship2 + parseInt(comission) + avtopmr + expedir + insur + park;
		
		$(".js-result-price").text(auto_price);
		$("input[name='car_bid']").val(auto_price);

		$(".js-result-acciz").text(acciz);
		$("input[name='car_acciz']").val(acciz);

		$(".js-result-acciz_single").text(acciz_single);
		$("input[name='car_acciz_single']").val(acciz_single);

		$(".js-result-poshlina").text(poshlina);
		$("input[name='car_poshlina']").val(poshlina);
		$("input[name='car_poshlina_per']").val(poshlina_per*100);

		$(".js-result-nds").text(nds);
		$("input[name='car_nds']").val(nds);
		$("input[name='car_nds_per']").val(nds_per*100);

		$(".js-result-pension").text(pension);
		$("input[name='car_pf']").val(pension);

		$(".js-result-pension_single").text(parseInt(pension_single * 100));
		$("input[name='car_pf_single']").val(parseInt(pension_single * 100));

		$(".js-result-avtopmr").text(avtopmr);
		$("input[name='car_avtopmr']").val(avtopmr);
		$("input[name='car_avtopmr_type']").val(400/*$('.js-calc-avtopmr option:selected').text()*/);

		$(".js-result-exp").text(expedir);
		$("input[name='car_exp']").val(expedir);

		$('.js-result-rastamojka-per').text(rastamoj_add);
		$("input[name='car_rastamojka_per']").val(rastamoj_add);

		$('.js-result-rastamojka').text(parseInt(rastamoj));
		$("input[name='car_rastamojka']").val(rastamoj);
		
		$(".js-result-ship1").text(ship1);
		$("input[name='car_delivery']").val(ship1);

		$(".js-result-ship2").text(ship2);
		$("input[name='car_delivery2']").val(ship2);

		$(".js-result-ship_days").text(ship_days);
		$("input[name='car_days']").val(ship_days);

		$(".js-result-ship_port").text(ship_port);
		$("input[name='car_port']").val(ship_port);

		$(".js-result-insur").text(insur);
		$("input[name='car_insur']").val(insur);

		$(".js-result-park").text(park);
		$("input[name='car_park']").val(park);

		$(".js-result-comission").text(comission);
		$("input[name='car_auction']").val(comission);
		
		$(".js-result-total_price").text(total_price);
		$("input[name='car_total']").val(total_price);
		
		$("input[name='car_age']").val($('.js-car-age option:selected').text())
		$("input[name='car_city']").val($('.js-calc-city option:selected').text())
		
		
		
		$(".js-calc-form .btn").show();
	}
	
});
