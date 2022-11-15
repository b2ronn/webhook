(function () {
	'use strict';
	function _typeof(obj) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
			return typeof obj;
		} : function (obj) {
			return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
		}, _typeof(obj);
	}
	var API = 'http://api.lampa.stream/', type = '', cards, ping_auth;

	var Modss = {
		init: function () {
			this.collections();
			this.source_pub();
			this.buttBack();
			ForkTV.init();
			this.radio();
		},
		radio: function () {
			var ico = '<svg width="24px" height="24px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" aria-labelledby="radioIconTitle" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" color="#000000"> <title id="radioIconTitle">Radio</title> <path d="M5.44972845 6C2.18342385 9.2663046 2.18342385 14.7336954 5.44972845 18M8.59918369 8C6.46693877 10.1322449 6.46693877 13.8677551 8.59918369 16M18.5502716 18C21.8165761 14.7336954 21.8165761 9.2663046 18.5502716 6M15.4008163 16C17.5330612 13.8677551 17.5330612 10.1322449 15.4008163 8"/> <circle cx="12" cy="12" r="1"/> </svg>';
			var menu_item = $('<li class="menu__item selector" data-action="Radio_n"><div class="menu__ico">' + ico + '</div><div class="menu__text">' + Lampa.Lang.translate('title_radio') + '</div></li>');
			menu_item.on('hover:enter', function () {
				Lampa.Activity.push({
					url: API + 'r/record/',
					title: Lampa.Lang.translate('title_radio'),
					component: 'Radio_n',
					page: 1
				});
			});
			if (Lampa.Storage.get('mods_radio')) $('body').find('.menu .menu__list').eq(0).append(menu_item);
			else $('body').find('[data-action="Radio_n"]').remove();
		},
		source_pub: function () {
			if (Lampa.Storage.field('mods_pub')) {
				Lampa.Params.select('source', {
					'tmdb': 'TMDB',
					'cub': 'CUB',
					'pub': 'PUB'
				}, 'tmdb');
			}
		},
		online: function (card) {
		  var balanser = Lampa.Storage.get('online_last_balanser');
		  var data = Lampa.Storage.cache('online_choice_' + balanser[card.id], 500, {});
		  var is_continue = card.number_of_seasons && data[card.id] && Lampa.Arrays.getKeys(data[card.id].episodes_view).length;
		  var last_s = is_continue ? ('S'+(data[card.id].season + 1)+' - '+(data[card.id].episodes_view[data[card.id].season == 0 ? 1 : (data[card.id].season +1)])+' '+Lampa.Lang.translate('torrent_serial_episode').toLowerCase()) : '';
		  var title = is_continue && Lampa.Storage.field('online_continued') ? '#{title_online_continue} ' : '#{title_online}';
			var reliase = Math.round(new Date(card && (card.release_date || card.first_air_date)).getTime() / 1000.0);
			var nowDate = Math.round(new Date().getTime() / 1000.0);
			var ico = '<svg viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 32 32"><path d="m17 14.5 4.2-4.5L4.9 1.2c-.1-.1-.3-.1-.6-.2L17 14.5zM23 21l5.9-3.2c.7-.4 1.1-1 1.1-1.8s-.4-1.5-1.1-1.8L23 11l-4.7 5 4.7 5zM2.4 1.9c-.3.3-.4.7-.4 1.1v26c0 .4.1.8.4 1.2L15.6 16 2.4 1.9zM17 17.5 4.3 31c.2 0 .4-.1.6-.2L21.2 22 17 17.5z" fill="currentColor" fill="#ffffff" class="fill-000000"></path></svg>';
			if (/*reliase < nowDate && */!$('.view--onlines_v1', Lampa.Activity.active().activity.render()).length && Lampa.Storage.field('mods_onl')) $('.view--torrent', Lampa.Activity.active().activity.render()).before(Lampa.Lang.translate("<div data-subtitle='Modss_v2.6 (14 Balansers)' class='full-start__button selector view--onlines_v1'>"+ico+"<span>"+title+"</span></div>"));
			if (!Lampa.Storage.field('mods_onl')) $('.view--onlines_v1', Lampa.Activity.active().activity.render()).remove();
      Lampa.Manifest.plugins = {
        type: 'video',
        version: '1.0.0',
        name: 'Онлайн - cloneMODS\'s',
        description: '',
        component: 'modss_online',
        onContextMenu: function onContextMenu(object) {
          return {
            name: Lampa.Lang.translate('online_watch'),
            description: ''
          };
        },
        onContextLauch: function onContextLauch(object) {
          Lampa.Activity.push({
  					url: '',
  					title: Lampa.Lang.translate('title_online') + " cloneMODS's",
  					component: 'modss_online',
  					search: card.title,
  					search_one: card.title,
  					search_two: card.original_title,
  					movie: card,
  					page: 1
  				});
        }
      };
			$('.view--onlines_v1', Lampa.Activity.active().activity.render()).unbind('hover:enter click.hover').on('hover:enter click.hover', function () {
		    if(is_continue && Lampa.Storage.field('online_continued')) 
		    Lampa.Select.show({
          title: Lampa.Lang.translate('title_action'),
          items: [{
            title: Lampa.Lang.translate('title_online_continue') + '? ' + last_s,
            yes: true
          }, {
            title: Lampa.Lang.translate('settings_param_no')
          }],
          onBack: function onBack() {
            Lampa.Select.hide();
            Lampa.Controller.toggle('content');
          },
          onSelect: function onSelect(a) {
            if (a.yes) {
              data[card.id].continued = true;
		          Lampa.Storage.set('online_choice_' + balanser[card.id], data);
            } 
            openOnline();
          }
        }); else openOnline();
        function openOnline(){
         Lampa.Activity.push({
        	url: '',
        	title: Lampa.Lang.translate('title_online') + " cloneMODS's",
        	component: 'modss_online',
        	search: card.title,
        	search_one: card.title,
        	search_two: card.original_title,
        	movie: card,
        	page: 1
        });
  			} 
			});
			$('.view--onlines_v1 span', Lampa.Activity.active().activity.render()).text(Lampa.Lang.translate(title));
		},
		collections: function () {
			var menu_item = $('<li class="menu__item selector" data-action="collection"><div class="menu__ico"><img src="./img/icons/menu/catalog.svg"/></div><div class="menu__text">' + Lampa.Lang.translate('title_collections') + '</div></li>');
			if (Lampa.Storage.get('mods_collection')) $('body').find('.menu .menu__list li:eq(3)').after(menu_item)
			else $('body').find('[data-action="collection"]').remove();
			menu_item.on('hover:enter', function () {
				var item = [{
				/*title: Lampa.Lang.translate('menu_collections')+' '+Lampa.Lang.translate('title_on_the')+ ' filmix',
					url: 'https://filmix.ac/playlists/rateup',
					source: 'filmix'
				}, {*/
						title: Lampa.Lang.translate('menu_collections') + ' ' + Lampa.Lang.translate('title_on_the') + ' rezka',
						url: 'http://hdrezka.co/collections/',
						source: 'rezka'
				}, {
						title: Lampa.Lang.translate('menu_collections') + ' ' + Lampa.Lang.translate('title_on_the') + ' kinopub',
						url: 'http://api.service-kp.com/v1/collections',
						source: 'pub'
				}];
				if (Lampa.Arrays.getKeys(Lampa.Storage.get('my_col')).length) {
					item.push({
						title: Lampa.Lang.translate('title_my_collections') + ' - ' + Lampa.Arrays.getKeys(Lampa.Storage.get('my_col')).length,
						url: 'http://api.service-kp.com/v1/collections',
						source: 'my_coll'
					});
				}
				Lampa.Select.show({
					title: Lampa.Lang.translate('menu_collections'),
					items: item,
					onSelect: function onSelect(a) {
						Lampa.Activity.push({
							url: a.url || '',
							sourc: a.source,
							source: Lampa.Storage.field('source'),
							title: a.title,
							card_cat: true,
							category: true,
							component: a.url ? 'collection' : 'collections',
							page: 1
						});
					},
					onBack: function onBack() {
						Lampa.Controller.toggle('content');
					}
				});
			});
		},
		buttBack: function (pos) {
			if ((/iPhone|iPad|iPod|android|x11/i.test(navigator.userAgent) || (Lampa.Platform.is('android') && window.innerHeight < 1080)) && Lampa.Storage.get('mods_butt_back')) {
				$('body').find('.elem-mobile-back').remove();
				var position = Lampa.Storage.field('mods_butt_pos') == 'left' ? 'left: 0;transform: scaleX(-1);' : 'right: 0;';
				$('body').append('<div class="elem-mobile-back"><style>.elem-mobile-back {' + position + 'position: fixed;z-index:99999;top: 50%;width: 3em;height: 6em;background-image: url(../icons/player/prev.svg);background-repeat: no-repeat;background-position: 100% 50%;-webkit-background-size: contain;-moz-background-size: contain;-o-background-size: contain;background-size: contain;margin-top: -3em;font-size: .72em;display: block}</style><svg width="131" height="262" viewBox="0 0 131 262" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M131 0C58.6507 0 0 58.6507 0 131C0 203.349 58.6507 262 131 262V0Z" fill="white"/><path d="M50.4953 125.318C50.9443 124.878 51.4313 124.506 51.9437 124.183L86.2229 90.4663C89.5671 87.1784 94.9926 87.1769 98.3384 90.4679C101.684 93.7573 101.684 99.0926 98.3384 102.385L68.8168 131.424L98.4907 160.614C101.836 163.904 101.836 169.237 98.4907 172.531C96.817 174.179 94.623 175 92.4338 175C90.2445 175 88.0489 174.179 86.3768 172.531L51.9437 138.658C51.4313 138.335 50.9411 137.964 50.4953 137.524C48.7852 135.842 47.9602 133.626 48.0015 131.421C47.9602 129.216 48.7852 127.002 50.4953 125.318Z" fill="black"/></svg></div>');
				$(".elem-mobile-back").on("click", function () {
					Lampa.Activity.back();
				});
			}
		},
		last_view: function (data) {
			var episodes = Lampa.TimeTable.get(data);
			var viewed;
			episodes.forEach(function (ep) {
				var hash = Lampa.Utils.hash([ep.season_number, ep.episode_number, data.original_title].join(''));
				var view = Lampa.Timeline.view(hash);
				if (view.percent) viewed = {
					ep: ep,
					view: view
				};
			});
			if (viewed) {
				var ep = viewed.ep.episode_number;
				var se = viewed.ep.season_number;
				var last_view = 'S' + se + ':E' + ep;
				if ($('body').find('.full-start__buttons').length) {
					$('.timeline, .card--last_view').remove();
					$('body').find('.full-start__poster').append("<div class='card--last_view' style='top:0.6em;right: -.5em;position: absolute;background: #168FDF;color: #fff;padding: 0.4em 0.4em;font-size: 1.2em;-webkit-border-radius: 0.3em;-moz-border-radius: 0.3em;border-radius: 0.3em;'><div style='float:left;margin:-5px 0 -4px -4px' class='card__icon icon--history'></div>" + last_view +"</div>").parent().append('<div class="timeline" style="position:relative;"></div>');
					$('body').find('.timeline').append(Lampa.Timeline.render(viewed.view));
				}
				if ($('body').find('.filter--sort').length) $('body').find('.files__left .time-line, .card--last_view').remove();
			} else $('body').find('.timeline,.card--last_view').remove();
			if ($('body').find('.online').length == 0) $('.card--new_ser,.card--viewed').remove();
		},
		serialInfo: function (card) {
			if (Lampa.Storage.field('mods_serial_info') && card.source == 'tmdb' && card.seasons && card.last_episode_to_air) {
				var last_seria = card.last_episode_to_air.episode_number;
				var last_seria_inseason = card.last_episode_to_air.season_number;
				var air_new_episode = card.last_episode_to_air.episode_number;
				var count_eps_last_seas;
				var new_ser;
				var seasons = card.seasons;
				this.last_view(card);
				seasons.forEach(function (eps) {
					if (eps.season_number == last_seria_inseason) count_eps_last_seas = eps.episode_count;
				});
				if (card.next_episode_to_air) {
					var add_ = '<b>' + last_seria;
					var notices = Lampa.Storage.get('account_notice', []).filter(function (n) {
						return n.card_id == card.id;
					});
					if (notices.length) {
						var notice = notices[0];
						var episod_new = JSON.parse(notice.data).card.seasons;
						if (Lampa.Utils.parseTime(notice.date).full == Lampa.Utils.parseTime(Date.now()).full) add_ = '#{season_new} <b>' + episod_new[last_seria_inseason];
					}
					new_ser = add_ + '</b> #{torrent_serial_episode} #{season_from} ' + count_eps_last_seas + ' - S' + last_seria_inseason;
				} else new_ser = last_seria_inseason + ' #{season_ended}';
				if(!$('.card--new_seria', Lampa.Activity.active().activity.render()).length) {
  				if(window.innerWidth > 585) $('.full-start__poster', Lampa.Activity.active().activity.render()).append("<div class='card--new_seria' style='right: -0.6em;position: absolute;background: #168FDF;color: #fff;bottom:.6em;padding: 0.4em 0.4em;font-size: 1.2em;-webkit-border-radius: 0.3em;-moz-border-radius: 0.3em;border-radius: 0.3em;'>" + Lampa.Lang.translate(new_ser) + "</div>");
  			  else {
  			    if($('.card--new_seria', Lampa.Activity.active().activity.render()).length)$('.full-start__tags', Lampa.Activity.active().activity.render()).append('<div class="full-start__tag card--new_seria"><img src="./img/icons/menu/movie.svg" /> <div>'+ Lampa.Lang.translate(new_ser) +'</div></div>');
  			    else $('.full-start-new__details', Lampa.Activity.active().activity.render()).append('<span class="full-start-new__split">●</span><div class="card--new_seria"><div>'+ Lampa.Lang.translate(new_ser) +'</div></div>');
  			  }
  		  }
			}
		}, 
	  rating_kp_imdb:function (card) {
			var relise = (card.number_of_seasons ? card.first_air_date : card.release_date) || '0000';
			var year = parseInt((relise + '').slice(0, 4));
  	//	if (Lampa.Storage.field('mods_rating') && $('.rate--kp', Lampa.Activity.active().activity.render()).hasClass('hide') && !$('.wait_rating', Lampa.Activity.active().activity.render()).length) 
			getRating();
    	function getRating() {
				  if (Lampa.Storage.field('mods_rating'))
				  $('.info__rate', Lampa.Activity.active().activity.render()).after('<div style="width:2em;margin-top:1em;margin-right:1em" class="wait_rating"><div class="broadcast__scan"><div></div></div><div>');
				  Pub.network.clear();
  				Pub.network.timeout(10000);
  				Pub.network.silent(API + 'KPrating', function (json) {
    				if(json.data.kp_id) card.kinopoisk_id = json.data.kp_id;
    				var kp = json.data.kp_rating;
  					var imdb = json.data.imdb_rating;
  					var kp_rating = !isNaN(kp) && kp !== null ? parseFloat(kp).toFixed(1) : '0.0';
  					var imdb_rating = !isNaN(imdb) && imdb !== null ? parseFloat(imdb).toFixed(1) : '0.0';
    				if (Lampa.Storage.field('mods_rating')){
    					$('.wait_rating',Lampa.Activity.active().activity.render()).remove();
    					$('.rate--imdb', Lampa.Activity.active().activity.render()).removeClass('hide').find('> div').eq(0).text(imdb_rating);
    					$('.rate--kp', Lampa.Activity.active().activity.render()).removeClass('hide').find('> div').eq(0).text(kp_rating);
    				} 
    			}, function (a, c) {
  					Lampa.Noty.show('MODSs ОШИБКА Рейтинг KP   ' + Pub.network.errorDecode(a, c));
  				}, {
  				  title:card.title, 
  				  year: year, 
  				  card_id:card.id, 
  				  imdb: card.imdb_id
  				}); 
			}
		}, 
		balansers: function() {
		  var balansers = {
        filmix: 'Filmix',
        videocdn: 'VideoCDN',
        rezka: 'HDRezka',
        kinobase: 'Kinobase',
        collaps: 'Collaps',
        kinotochka: 'KinoTochka',
        kinokrad: 'kinokrad'
      };
      if (Lampa.Storage.get('pro_pub', false)) balansers['pub'] = 'Pub';
      return balansers;
    }
	}; 
	var Filmix = {
		network: new Lampa.Reguest(),
		api_url: 'http://filmixapp.cyou/api/v2/',
		user_dev: '?user_dev_apk=2.0.1&user_dev_id=' + Lampa.Utils.uid(16) + '&user_dev_name=Xiaomi&user_dev_os=11&user_dev_vendor=Xiaomi&user_dev_token=',
		add_new: function () {
			var user_code = '';
			var user_token = '';
			var modal = $('<div><div class="broadcast__text">' + Lampa.Lang.translate('filmix_modal_text') + '</div><div class="broadcast__device selector" style="text-align: center">Ожидаем код...</div><br><div class="broadcast__scan"><div></div></div></div></div>');
			Lampa.Modal.open({
				title: '',
				html: modal,
				onBack: function onBack() {
					Lampa.Modal.close();
					Lampa.Controller.toggle('settings_component');
					clearInterval(ping_auth);
				},
				onSelect: function onSelect() {
					Lampa.Utils.copyTextToClipboard(user_code, function () {
						Lampa.Noty.show(Lampa.Lang.translate('filmix_copy_secuses'));
					}, function () {
						Lampa.Noty.show(Lampa.Lang.translate('filmix_copy_fail'));
					});
				}
			});
			ping_auth = setInterval(function () {
				Filmix.checkPro(user_token, function () {
					Lampa.Modal.close();
					clearInterval(ping_auth);
					Lampa.Storage.set("filmix_token", user_token);
					$('[data-name="filmix_token"] .settings-param__value').text(user_token);
					Lampa.Controller.toggle('settings_component');
				});
			}, 2000);
			this.network.clear();
			this.network.timeout(10000);
			this.network.quiet(this.api_url + 'token_request' + this.user_dev, function (found) {
				if (found.status == 'ok') {
					user_token = found.code;
					user_code = found.user_code;
					modal.find('.selector').text(user_code);
				} else {
					Lampa.Noty.show(found);
				}
			}, function (a, c) {
				Lampa.Noty.show(Filmix.network.errorDecode(a, c));
			});
		},
		showStatus: function (ch) {
			var status = Lampa.Storage.get("filmix_status", '{}');
			var statuss = $('.settings-param__status', ch).removeClass('active error wait').addClass('wait');
			var info = Lampa.Lang.translate('filmix_nodevice');
			statuss.removeClass('wait').addClass('error');
			if (status.login) {
				statuss.removeClass('wait').addClass('active');
				var foto = '<img width="30em" src="' + (status.foto.indexOf('noavatar') == -1 ? status.foto : './img/logo-icon.svg') + '"> <span style="vertical-align: middle;"><b style="font-size:1.3em;color:#FF8C00">' + status.login + '</b>';
				if (status.is_pro || status.is_pro_plus) info = foto + ' - <b>' + (status.is_pro ? 'PRO' : 'PRO_PLUS') + '</b> ' + Lampa.Lang.translate('filter_rating_to') + ' - ' + status.pro_date + '</span>';
				else info = foto + ' - <b>NO PRO</b> - MAX quality 720p</span>';
			}
			if (ch) $('.settings-param__descr', ch).html(info);
			else $('.settings-param__descr:eq(0)').html(info);
		},
		checkPro: function (token, call) {
			this.network.clear();
			this.network.timeout(8000);
			token = token ? token : Lampa.Storage.get("filmix_token");
			var url = this.api_url + 'user_profile' + this.user_dev + token;
			this.network.silent(url, function (json) {
				if (json) {
					if (json.user_data) {
						Lampa.Storage.set("filmix_status", json.user_data);
						if (call) call();
					} else {
						Lampa.Storage.set("filmix_status", {});
					}
					Filmix.showStatus();
				}
			}, function (a, c) {
				Lampa.Noty.show(Filmix.network.errorDecode(a, c));
			});
		}
	};
	var ForkTV = {
		network: new Lampa.Reguest(),
		url: 'http://no_save.forktv.me',
		forktv_id: Lampa.Storage.field('forktv_id'),
		user_dev: 'box_client=lg&box_mac=' + Lampa.Storage.field('forktv_id') + '&initial=ForkXMLviewer|' + Lampa.Storage.field('forktv_id') + '|YAL-L41%20sdk%2029|' + Lampa.Storage.field('forktv_id') + '872b|MTY1MjI4NTM0NAR=E1341|7AD953401F39875|androidapi|0|Android-device_YAL-L41_sdk_29&vr=0&platform=android-device&country=&tvp=0&hw=1.6&cors=android-device&refresh=true',
		openBrowser: function (url) {
			if (Lampa.Platform.is('tizen')) {
				var e = new tizen.ApplicationControl("https://tizen.org/appcontrol/operation/view", url);
				tizen.application.launchAppControl(e, null, function () {}, function (e) {
					Lampa.Noty.show(e);
				});
			} else if (Lampa.Platform.is('webos')) {
				webOS.service.request("luna://com.webos.applicationManager", {
					method: "launch",
					parameters: {
						id: "com.webos.app.browser",
						params: {
							target: url
						}
					},
					onSuccess: function () {},
					onFailure: function (e) {
						Lampa.Noty.show(e);
					}
				});
			} else window.open(url, '_blank');
		},
		init: function () {
			this.check_forktv('', true);
			if (this.forktv_id == 'undefined') {
				this.forktv_id = this.create_dev_id();
				Lampa.Storage.set('forktv_id', this.forktv_id);
			}
		},
		create_dev_id: function () {
			var charsets, index, result;
			result = "";
			charsets = "0123456789abcdef";
			while (result.length < 12) {
				index = parseInt(Math.floor(Math.random() * 15));
				result = result + charsets[index];
			}
			return result;
		},
		copyCode: function (id) {
			Lampa.Utils.copyTextToClipboard(id, function () {
				Lampa.Noty.show(Lampa.Lang.translate('filmix_copy_secuses'));
			}, function () {
				Lampa.Noty.show(Lampa.Lang.translate('filmix_copy_fail'));
			});
		},
		cats_fork: function (json) {
			var item = [];
			var get_cach = Lampa.Storage.get('ForkTv_cat', '');
			if (!get_cach) {
				json.forEach(function (itm, i) {
				//	if (itm.title !== 'Новости' /* && itm.title !== 'IPTV'*/ ) {
						item.push({
							title: itm.title,
							url: itm.playlist_url,
							img: itm.logo_30x30,
							checkbox: true
						});
					//}
				});
			} else item = get_cach.cat;

			function select(where, a) {
				where.forEach(function (element) {
					element.selected = false;
				});
				a.selected = true;
			}

			function main() {
				Lampa.Controller.toggle('settings_component');
				var cache = Lampa.Storage.cache('ForkTv_cat', 1, {});
				var catg = [];
				item.forEach(function (a) {
					catg.push(a);
				});
				if (catg.length > 0) {
					cache = {
						cat: catg
					};
					Lampa.Storage.set('ForkTv_cat', cache);
				}
				Lampa.Controller.toggle('settings');
				Lampa.Activity.back();
				ForkTV.parse();
			}
			Lampa.Select.show({
				items: item,
				title: get_cach ? Lampa.Lang.translate('title_fork_edit_cats') : Lampa.Lang.translate('title_fork_add_cats'),
				onBack: main,
				onSelect: function onSelect(a) {
					select(item, a);
					main();
				}
			});
		},
		but_add: function () {
			var ico = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke="#ffffff" stroke-width="2" class="stroke-000000"><path d="M4.4 2h15.2A2.4 2.4 0 0 1 22 4.4v15.2a2.4 2.4 0 0 1-2.4 2.4H4.4A2.4 2.4 0 0 1 2 19.6V4.4A2.4 2.4 0 0 1 4.4 2Z"></path><path d="M12 20.902V9.502c-.026-2.733 1.507-3.867 4.6-3.4M9 13.5h6"></path></g></svg>';
			var menu_item = $('<li class="menu__item selector" data-action="forktv"><div class="menu__ico">' + ico + '</div><div class="menu__text">ForkTV</div></li>');
			menu_item.on('hover:enter', this.parse);
			$('body').find('[data-action="forktv"]').remove();
			if (Lampa.Storage.get('mods_fork') && Lampa.Storage.get('forktv_auth')) $('.menu .menu__list').eq(0).append(menu_item);
		},
		updMac: function (itm) {
			this.forktv_id = ForkTV.create_dev_id();
			this.user_dev = 'box_client=lg&box_mac=' + this.forktv_id + '&initial=ForkXMLviewer|' + this.forktv_id + '|YAL-L41%20sdk%2029|' + this.forktv_id + '872b|MTY1MjI4NTM0NAR=E1341|7AD953401F39875|androidapi|0|Android-device_YAL-L41_sdk_29&vr=0&platform=android-device&country=&tvp=0&hw=1.6&cors=android-device',
				Lampa.Storage.set('forktv_id', this.forktv_id);
			clearInterval(ping_auth);
			ForkTV.check_forktv(itm);
			$('.settings-param__descr', itm).text(Lampa.Lang.translate('title_fork_new') + ' ID/MAC: ' + ForkTV.forktv_id);
			Lampa.Noty.show('ID/MAC ' + Lampa.Lang.translate('succes_update_noty'));
		},
		parse: function () {
			ForkTV.check(ForkTV.url, function (json) {
				json = json.channels;
				if (json.length === 1) ForkTV.checkAdd();
				else {
					ForkTV.but_add();
					if (Lampa.Storage.get('ForkTv_cat') !== '') {
						var get_cach = Lampa.Storage.get('ForkTv_cat');
						var itms = [];
						get_cach.cat.forEach(function (it) {
							if (it.checked) itms.push({
								title: it.title,
								playlist_url: it.url,
								logo_30x30: it.img,
								home: true
							});
						});
						if (itms.length > 0) {
							Lampa.Activity.push({
								title: 'ForkTV',
								url: {
									channels: itms
								},
								submenu: true,
								component: 'forktv',
								page: 1
							});
						} else ForkTV.cats_fork(json);
					} else ForkTV.cats_fork(json);
				}
			});
		},
		check_forktv: function (itm, ar) {
			var status = $('.settings-param__status', itm).removeClass('active error wait').addClass('wait');
			this.network.silent(ForkTV.url + '?' + ForkTV.user_dev, function (json) {
				if (json.channels.length === 1) {
					if (ar) {
						Lampa.Storage.set('forktv_auth', false);
						status.removeClass('wait').addClass('error');
						$('.settings-param__descr', itm).text(Lampa.Lang.translate('filmix_nodevice'));
						$('body').find('[data-action="forktv"]').remove();
					} else {
						ForkTV.checkAdd();
						$('body').find('[data-action="forktv"]').remove();
						$('.settings [data-static="true"]:eq(1), .settings [data-static="true"]:eq(2)').hide();
						$('.settings [data-static="true"]:eq(0) .settings-param__status').removeClass('active').addClass('error');
						$('.settings [data-static="true"]:eq(0) .settings-param__descr').text(Lampa.Lang.translate('filmix_nodevice'));
					}
				} else {
					ForkTV.but_add();
					Lampa.Storage.set('forktv_auth', true);
					status.removeClass('wait').addClass('active');
					if (itm) {
						if (itm.text().indexOf('код') == -1 || itm.text().indexOf('code') == -1) $('.settings-param__descr', itm).html('<img width="30em" src="./img/logo-icon.svg"> <b style="vertical-align: middle;font-size:1.4em;color:#FF8C00">' + Lampa.Lang.translate('account_authorized') + '</b>');
						if (itm.find('.settings-param__name').text().indexOf('раздел') > -1 || itm.find('.settings-param__name').text().indexOf('Sections') > -1) ForkTV.cats_fork(json.channels);
					}
				}
			}, function (e) {
				if (ar) {
					Lampa.Storage.set('forktv_auth', false);
					status.removeClass('wait').addClass('error');
					$('.settings-param__descr', itm).text(Lampa.Lang.translate('filmix_nodevice'));
					$('body').find('[data-action="forktv"]').remove();
				} else {
					ForkTV.checkAdd();
					$('body').find('[data-action="forktv"]').remove();
					$('.settings [data-static="true"]:eq(0) .settings-param__status').removeClass('active').addClass('error');
					$('.settings [data-static="true"]:eq(0) .settings-param__descr').text(Lampa.Lang.translate('filmix_nodevice'));
					$('.settings [data-static="true"]:eq(1), .settings [data-static="true"]:eq(2)').hide();
				}
			}, false, {
				dataType: 'json'
			});
		},
		checkAdd: function () {
			var modal = $('<div><div class="broadcast__text" style="text-align:left">' + Lampa.Lang.translate('fork_auth_modal_title') + '</div><div class="broadcast__device selector" style="background-color:#fff;color:#000;text-align: center">' + this.forktv_id + '</div></div><br><div class="broadcast__scan"><div></div></div><br><div class="broadcast__text">' + Lampa.Lang.translate('fork_modal_wait') + '</div></div>');
			var enabled = Lampa.Controller.enabled().name;
			Lampa.Modal.open({
				title: '',
				html: modal,
				size: 'small',
				mask: true,
				onBack: function onBack() {
					clearInterval(ping_auth);
					Lampa.Modal.close();
					Lampa.Controller.toggle(enabled);
				},
				onSelect: function onSelect() {
					ForkTV.copyCode(ForkTV.forktv_id);
				}
			});
			if (!Lampa.Platform.tv()) {
				setTimeout(function () {
					ForkTV.copyCode(ForkTV.forktv_id);
				}, 1000);
			}
			modal.find('a').on('click', function () {
				ForkTV.openBrowser('http://forktv.me');
			});
			ping_auth = setInterval(function () {
				ForkTV.check(ForkTV.url, function () {
					Lampa.Modal.close();
					clearInterval(ping_auth);
					if (enabled == 'settings_component') Lampa.Activity.back();
					Lampa.Controller.toggle(enabled);
					Lampa.Storage.set('forktv_auth', true);
					ForkTV.parse();
				}, true);
			}, 5000);
		},
		check: function (url, call, ar) {
			this.network.clear();
			this.network.timeout(8000);
			this.network.silent(url + '?' + ForkTV.user_dev, function (json) {
				if (json) {
					if (ar && json.channels.length > 1) {
						if (call) call(json);
					} else if (!ar) call(json);
				}
			}, function (a, c) {
				Lampa.Noty.show(ForkTV.network.errorDecode(a, c));
			});
		}
	};
	var Pub = {
		network: new Lampa.Reguest(),
		baseurl: 'http://api.service-kp.com/',
		token: Lampa.Storage.get('pub_access_token', 'oqtpuyprwv91yfvus3pzrkvedxp5kq8x'),
		openBrowser: function (url) {
			if (Lampa.Platform.is('tizen')) {
				var e = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/view", url);
				tizen.application.launchAppControl(e, null, function (r) {}, function (e) {
					Lampa.Noty.show(e);
				});
			} else if (Lampa.Platform.is('webos')) {
				webOS.service.request("luna://com.webos.applicationManager", {
					method: "launch",
					parameters: {
						id: "com.webos.app.browser",
						params: {
							target: url
						}
					},
					onSuccess: function () {},
					onFailure: function (e) {
						Lampa.Noty.show(e);
					}
				});
			} else window.open(url, '_blank');
		},
		Auth_pub: function () {
			Pub.network.silent(Pub.baseurl + 'oauth2/device', function (json) {
				Lampa.Storage.set('pub_user_code', json.user_code);
				Lampa.Storage.set('pub_code', json.code);
				Pub.checkAdd();
			}, function (a, c) {
				Lampa.Noty.show(Pub.network.errorDecode(a, c));
			}, {
				'grant_type': 'device_code',
				'client_id': 'xbmc',
				'client_secret': 'cgg3gtifu46urtfp2zp1nqtba0k2ezxh'
			});
		},
		checkAdd: function () {
			var modal = $('<div><div class="broadcast__text">' + Lampa.Lang.translate('pub_modal_title') + '</div><div class="broadcast__device selector" style="background-color:#fff;color:#000;text-align: center"></div></div><br><div class="broadcast__scan"><div></div></div><br><div class="broadcast__text"><b style="font-size:1em">' + Lampa.Lang.translate('pub_title_wait') + '</b></div></div>');
			Lampa.Modal.open({
				title: '',
				html: modal,
				size: 'small',
				mask: true,
				onBack: function onBack() {
					Lampa.Modal.close();
					clearInterval(ping_auth);
					Lampa.Controller.toggle('settings_component');
				},
				onSelect: function onSelect() {
					if (!Lampa.Platform.tv()) {
						Lampa.Utils.copyTextToClipboard(Lampa.Storage.get('pub_user_code'), function () {
							Lampa.Noty.show(Lampa.Lang.translate('filmix_copy_secuses'));
						}, function () {
							Lampa.Noty.show(Lampa.Lang.translate('filmix_copy_fail'));
						});
					} else Pub.openBrowser('http://kino.pub');
				}
			});
			modal.find('a').on('click', function () {
				Pub.openBrowser('http://kino.pub');
			});
			modal.find('.selector').text(Lampa.Storage.get('pub_user_code'));
			var check = function check(url, call) {
				Pub.network.clear();
				Pub.network.timeout(8000);
				Pub.network.silent(url, function (json) {
					Lampa.Storage.set('pub_access_token', json.access_token);
					Lampa.Storage.set('pub_refresh_token', json.refresh_token);
					Pub.token = Lampa.Storage.get('pub_access_token');
					if (!Lampa.Platform.is('android')) var uas = navigator.userAgent.match(/\((.*?)\)/i)[1].split(';');
					Pub.network.silent(Pub.baseurl + 'v1/device/info?access_token=' + json.access_token, function (json) {
						Pub.network.silent(Pub.baseurl + 'v1/device/notify?access_token=' + Pub.token, function (json) {
							if (call) call();
						}, function (a, c) {
							Lampa.Noty.show(Pub.network.errorDecode(a, c));
						}, {
							'title': Lampa.Platform.is('android') ? 'KinoPub Android-Lampa' : uas.length > 3 ? 'Kinopub TV-Lampa' : uas[0] + ' ' + Lampa.Platform.get().toUpperCase(),
							'hardware': Lampa.Platform.is('android') ? 'Android 10' : uas[2],
							'software': Lampa.Platform.is('android') ? 'Android' : uas.length > 3 ? uas[1] : uas[0]
						});
					});
				}, false, {
					'grant_type': 'device_token',
					'client_id': 'xbmc',
					'client_secret': 'cgg3gtifu46urtfp2zp1nqtba0k2ezxh',
					'code': Lampa.Storage.get('pub_code')
				});
			};
			ping_auth = setInterval(function () {
				check(Pub.baseurl + 'oauth2/device', function () {
					clearInterval(ping_auth);
					Lampa.Modal.close();
					Lampa.Storage.set('logined_pub', true);
					Lampa.Settings.update();
				});
			}, 5000);
		},
		refreshTok: function () {
			this.network.silent(Pub.baseurl + 'oauth2/token', function (json) {
				Lampa.Storage.set('pub_access_token', json.access_token);
				Lampa.Storage.set('pub_refresh_token', json.refresh_token);
				Pub.token = Lampa.Storage.get('pub_access_token');
				Lampa.Noty.show('ТОКЕН обновлён');
			}, function (a, c) {
				Lampa.Noty.show(Pub.network.errorDecode(a, c));
			}, {
				'grant_type': 'refresh_token',
				'refresh_token': Lampa.Storage.get('pub_refresh_token'),
				'client_id': 'xbmc',
				'client_secret': 'cgg3gtifu46urtfp2zp1nqtba0k2ezxh'
			});
		},
		userInfo: function (itm, ur) {
			var status = $('.settings-param__status', itm).removeClass('active error wait').addClass('wait');
			if (!Pub.token) status.removeClass('wait').addClass('error');
			else {
				this.network.silent(Pub.baseurl + 'v1/user?access_token=' + Pub.token, function (json) {
					$('.settings-param__' + (!ur ? 'name' : 'descr'), itm).html('<img width="30em" src="' + json.user.profile.avatar + '">  <span style="vertical-align: middle;"><b style="font-size:1.4em;color:#FF8C00">' + json.user.username + '</b> - ' + Lampa.Lang.translate('pub_title_left_days') + '<b>' + json.user.subscription.days + '</b> ' + Lampa.Lang.translate('pub_title_left_days_d') + '</span>');
					$('.settings-param__' + (!ur ? 'descr' : ''), itm).html(Lampa.Lang.translate('pub_title_regdate') + ' ' + Lampa.Utils.parseTime(json.user.reg_date * 1000).full + '<br>' + (json.user.subscription.active ? Lampa.Lang.translate('pub_date_end_pro') + ' ' + Lampa.Utils.parseTime(json.user.subscription.end_time * 1000).full : '<b style="color:#cdd419">' + Lampa.Lang.translate('pub_title_not_pro') + '</b>'));
					status.removeClass('wait').addClass('active');
					Lampa.Storage.set('logined_pub', true);
					Lampa.Storage.set('pro_pub', json.user.subscription.active);
				}, function (a, c) {
					status.removeClass('wait').addClass('error');
					Lampa.Storage.set('pub_access_token', '');
					Lampa.Storage.set('logined_pub', false);
					Pub.token = Lampa.Storage.get('pub_access_token', 'oqtpuyprwv91yfvus3pzrkvedxp5kq8x');
					Pub.userInfo(itm, ur);
				});
			}
		},
		info_device: function () {
			this.network.silent(Pub.baseurl + 'v1/device/info?access_token=' + Pub.token, function (json) {
				var enabled = Lampa.Controller.enabled().name;
				var opt = json.device.settings;
				var subtitle = {
					supportSsl: {
						title: 'Использовать SSL (https) для картинок и видео'
					},
					supportHevc: {
						title: 'HEVC или H.265 — формат Видеосжатия с применением более эффективных алгоритмов по сравнению с H.264/AVC. Убедитесь, что ваше устройство поддерживает Данный формат.'
					},
					support4k: {
						title: '4K или Ultra HD - фильм в сверхвысокой чёткости 2160p. Убедитесь, что ваше устройство и ТВ, поддерживает данный формат.'
					},
					mixedPlaylist: {
						title: 'Плейлист с AVC и HEVC потоками. В зависимости от настроек, устройство будет автоматически проигрывать нужный поток. Доступно только для 4К - фильмов. Убедитесь, что ваше устройство поддерживает данный формат плейлиста.'
					},
					HTTP: {
						title: 'Неадаптивный, качество через настройки (Настройки > плеер > качество видео), все аудио, нет сабов.'
					},
					HLS: {
						title: 'Неадаптивный, качество через настройки, одна аудиодорожка, нет сабов.'
					},
					HLS2: {
						title: 'Адаптивный, качество автоматом, одна аудиодорожка, нет сабов.'
					},
					HLS4: {
						title: 'Рекомендуется! - Адаптивный, качество автоматом, все аудио, сабы.'
					}
				};
				var item = [{
					title: 'Тип потока',
					value: opt.streamingType,
					type: 'streamingType'
			}, {
					title: 'Переключить сервер',
					value: opt.serverLocation,
					type: 'serverLocation'
			}];
				Lampa.Arrays.getKeys(opt).forEach(function (key) {
					var k = opt[key];
					if (!k.type) item.push({
						title: k.label,
						value: k.value,
						type: key,
						subtitle: subtitle[key] && subtitle[key].title,
						checkbox: k.type ? false : true,
						checked: k.value == 1 ? true : false
					});
				});

				function main(type, value) {
					var edited = {};
					item.forEach(function (a) {
						if (a.checkbox) edited[a.type] = a.checked ? 1 : 0;
					});
					if (type) edited[type] = value;
					Pub.network.silent(Pub.baseurl + 'v1/device/' + json.device.id + '/settings?access_token=' + Pub.token, function (json) {
						Lampa.Noty.show(Lampa.Lang.translate('pub_device_options_edited'));
						Lampa.Controller.toggle(enabled);
					}, function (a, c) {
						Lampa.Noty.show(Pub.network.errorDecode(a, c));
					}, edited);
				}
				Lampa.Select.show({
					items: item,
					title: Lampa.Lang.translate('pub_device_title_options'),
					onBack: main,
					onSelect: function (i) {
						var serv = [];
						i.value.value.forEach(function (i) {
							serv.push({
								title: i.label,
								value: i.id,
								subtitle: subtitle[i.label] && subtitle[i.label].title,
								selected: i.selected
							});
						});
						Lampa.Select.show({
							items: serv,
							title: i.title,
							onBack: main,
							onSelect: function (a) {
								main(i.type, a.value);
							}
						});
					}
				});
			}, function (a, c) {
				Lampa.Noty.show(Pub.network.errorDecode(a, c));
			});
		},
		delete_device: function (call) {
			this.network.silent(Pub.baseurl + 'v1/device/unlink?access_token=' + Pub.token, function (json) {
				Lampa.Noty.show(Lampa.Lang.translate('pub_device_dell_noty'));
				Lampa.Storage.set('logined_pub', false);
				Lampa.Storage.set('pub_access_token', '');
				Pub.token = Lampa.Storage.get('pub_access_token', 'oqtpuyprwv91yfvus3pzrkvedxp5kq8x');
				if (call) call();
			}, function (a, c) {
				Lampa.Noty.show(Lampa.Lang.translate('pub_device_dell_noty'));
				Lampa.Storage.set('logined_pub', false);
				Lampa.Storage.set('pub_access_token', '');
				Pub.token = Lampa.Storage.get('pub_access_token', 'oqtpuyprwv91yfvus3pzrkvedxp5kq8x');
				if (call) call();
				Lampa.Noty.show(Pub.network.errorDecode(a, c));
			}, {});
		}
	};
	
	function videocdn(component, _object) {
    var network = new Lampa.Reguest();
    var extract = {};
    var results = [];
    var object = _object;
    var get_links_wait = false;
    var filter_items = {};
    var choice = {
      season: 0,
      voice: 0,
      voice_name: '',
      voice_id: 0, 
      order: 0
    };

    this.search = function (_object, data) {
      object = _object;
      get_links_wait = true;
      var url = component.proxy('videocdn') + 'http://cdn.svetacdn.in/api/';
      var itm = data[0];
      if (!itm.iframe_src) return component.doesNotAnswer();
      var type = itm.iframe_src.split('/').slice(-2)[0];
      if (type == 'movie') type = 'movies';
      url += type;
      url = Lampa.Utils.addUrlComponent(url, 'api_token=3i40G5TSECmLF77oAqnEgbx61ZWaOYaE');
      url = Lampa.Utils.addUrlComponent(url, itm.imdb_id ? 'imdb_id=' + encodeURIComponent(itm.imdb_id) : 'title=' + encodeURIComponent(itm.title));
      url = Lampa.Utils.addUrlComponent(url, 'field=' + encodeURIComponent('global'));
      network.silent(url, function (found) {
        results = found.data.filter(function (elem) {
          return elem.id == itm.id;
        });
        if(!results.length) component.doesNotAnswer();
        else{
          try{
            success(results);
          }
          catch(e){
            component.doesNotAnswer();
          }
        }
        component.loading(false);
        if (!results.length) component.doesNotAnswer();
      }, function (a, c) {
        component.doesNotAnswer();
      });
    };

    this.extendChoice = function (saved) {
      Lampa.Arrays.extend(choice, saved, true);
    };

    this.reset = function () {
      component.reset();
      choice = {
        season: 0,
        voice: 0,
        voice_name: '',
        voice_id: 0, 
        order: 0
      };
      filter();
      append(filtred());
    };

    this.filter = function (type, a, b) {
      choice[a.stype] = b.index;

      if (a.stype == 'voice') {
        choice.voice_name = filter_items.voice[b.index];
        choice.voice_id = filter_items.voice_info[b.index] && filter_items.voice_info[b.index].id;
      }

      component.reset();
      filter();
      append(filtred());
    };

    this.destroy = function () {
      network.clear();
      results = null;
    };

    function success(json) {
      results = json;
      extractData(json);
      filter();
      append(filtred());
    }

    function extractItems(str, max_quality) {
      try {
        var items = str.split(',').map(function (item) {
          return {
            quality: parseInt(item.match(/\[(\d+)p\]/)[1]),
            file: 'http:' + item.replace(/\[\d+p\]/, '').split(' or ')[0]
          };
        }).filter(function (item) {
          return item.quality <= max_quality;
        });
        items.sort(function (a, b) {
          return b.quality - a.quality;
        });
        return items;
      } catch (e) {}

      return [];
    }

    function extractData(results) {
      network.timeout(20000);
      var movie = results.slice(0, 1)[0];
      extract = {};

      if (movie) {
        var src = movie.iframe_src;
        network["native"]('http:' + src, function (raw) {
          get_links_wait = false;
          component.render().find('.online-prestige__scan-file').remove();
          var math = raw.replace(/\n/g, '').match(/id="files" value="(.*?)"/);

          if (math) {
            var json = Lampa.Arrays.decodeJson(math[1].replace(/&quot;/g, '"'), {});
            var text = document.createElement("textarea");

            var _loop = function _loop(i) {
              var _movie$media, _movie$media$filter$;

              if (0 === i - 0) {
                return "continue";
              }

              text.innerHTML = json[i];
              Lampa.Arrays.decodeJson(text.value, {});
              var max_quality = (_movie$media = movie.media) === null || _movie$media === void 0 ? void 0 : (_movie$media$filter$ = _movie$media.filter(function (obj) {
                return obj.translation_id === i - 0;
              })[0]) === null || _movie$media$filter$ === void 0 ? void 0 : _movie$media$filter$.max_quality;

              if (!max_quality) {
                var _movie$translations, _movie$translations$f;

                max_quality = (_movie$translations = movie.translations) === null || _movie$translations === void 0 ? void 0 : (_movie$translations$f = _movie$translations.filter(function (obj) {
                  return obj.id === i - 0;
                })[0]) === null || _movie$translations$f === void 0 ? void 0 : _movie$translations$f.max_quality;
              }

              extract[i] = {
                json: Lampa.Arrays.decodeJson(text.value, {}),
                items: extractItems(json[i], max_quality)
              };

              for (var a in extract[i].json) {
                var elem = extract[i].json[a];

                if (elem.folder) {
                  for (var f in elem.folder) {
                    var folder = elem.folder[f];
                    folder.items = extractItems(folder.file, max_quality);
                  }
                } else elem.items = extractItems(elem.file, max_quality);
              }
            };

            for (var i in json) {
              var _ret = _loop(i);

              if (_ret === "continue") continue;
            }
          }
        }, function () {
          get_links_wait = false;
          component.render().find('.online-prestige__scan-file').remove();
        }, false, {
          dataType: 'text'
        });
      }
    }

    function getFile(element, max_quality) {
      var translat = extract[element.translation];
      var id = element.season + '_' + element.episode;
      var file = '';
      var items = [];
      var quality = false;

      if (translat) {
        if (element.season) {
          for (var i in translat.json) {
            var elem = translat.json[i];

            if (elem.folder) {
              for (var f in elem.folder) {
                var folder = elem.folder[f];

                if (folder.id == id) {
                  items = folder.items;
                  break;
                }
              }
            } else if (elem.id == id) {
              items = elem.items;
              break;
            }
          }
        } else {
          items = translat.items;
        }
      }

      max_quality = parseInt(max_quality);

      if (items && items.length) {
        quality = {};
        var mass = [1080, 720, 480, 360];
        mass = mass.slice(mass.indexOf(max_quality));
        mass.forEach(function (n) {
          var exes = items.find(function (a) {
            return a.quality == n;
          });

          if (exes) {
            if (!file) file = exes.file;
            quality[n + 'p'] = exes.file;
          }
        });
        var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
        if (quality[preferably]) file = quality[preferably];
      }

      return {
        file: file,
        quality: quality
      };
    }

    function filter() {
      filter_items = {
        season: [],
        voice: [],
        voice_info: [], 
        order: []
      };
      results.slice(0, 1).forEach(function (movie) {
        if (movie.season_count) {
          component.order.forEach(function (i){
  					filter_items.order.push(i.title);
  				});
          
          var s = movie.season_count;

          while (s--) {
            filter_items.season.push(Lampa.Lang.translate('torrent_serial_season') + ' ' + (movie.season_count - s));
          }
        }

        if (filter_items.season.length) {
          movie.episodes.forEach(function (episode) {
            if (episode.season_num == choice.season + 1) {
              episode.media.forEach(function (media) {
                if (!filter_items.voice_info.find(function (v) {
                  return v.id == media.translation.id;
                })) {
                  filter_items.voice.push(media.translation.shorter_title);
                  filter_items.voice_info.push({
                    id: media.translation.id
                  });
                }
              });
            }
          });
        }
      });

      if (choice.voice_name) {
        var inx = filter_items.voice.map(function (v) {
          return v.toLowerCase();
        }).indexOf(choice.voice_name.toLowerCase());
        if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
          choice.voice = inx;
        }
      }

      component.filter(filter_items, choice);
    }

    function filtred() {
      var filtred = [];
      
      if (object.movie.name) {
        results.slice(0, 1).forEach(function (movie) {
          movie.episodes.forEach(function (episode) {
            if (episode.season_num == choice.season + 1) {
              var temp = episode.media.map(function (m) {
                return m;
              });
              var unique = [];
              temp.sort(function (a, b) {
                return b.max_quality - a.max_quality;
              });
              temp.forEach(function (m) {
                if (!unique.find(function (a) {
                  return a.translation.id == m.translation.id;
                })) {
                  unique.push(m);
                }
              });
              episode.media.forEach(function (media) {
                if (media.translation.id == filter_items.voice_info[choice.voice].id && unique.indexOf(media) !== -1) {
                  filtred.push({
                    episode: parseInt(episode.num),
                    season: episode.season_num,
                    title: episode.ru_title,
                    quality: media.max_quality + 'p' + (media.source_quality ? ' - ' + media.source_quality.toUpperCase() : ''),
                    translation: media.translation_id,
                    info: filter_items.voice[choice.voice],
                    voice_name: filter_items.voice[choice.voice]
                  });
                }
              });
            }
          });
        });
      } else {
        results.slice(0, 1).forEach(function (movie) {
          movie.media.forEach(function (element) {
            filtred.push({
              title: element.translation.shorter_title,
              quality: element.max_quality + 'p' + (element.source_quality ? ' - ' + element.source_quality.toUpperCase() : ''),
              translation: element.translation_id,
              voice_name: element.translation.shorter_title
            });
          });
        });
      }
      return component.order[choice.order].id == 'invers' ? filtred.reverse() : filtred;
    }

    function toPlayElement(element) {
      var extra = getFile(element, element.quality);
      var play = {
        title: element.title,
        url: extra.file,
        quality: extra.quality,
        timeline: element.timeline,
        callback: element.mark
      };
      return play;
    }

    function append(items) {
      component.reset();
      component.draw(items, {
        onRender: function onRender(item, html) {
          if (get_links_wait) html.find('.online-prestige__body').append($('<div class="online-prestige__scan-file"><div class="broadcast__scan"><div></div></div></div>'));
        },
        onEnter: function onEnter(item, html) {
          var extra = getFile(item, item.quality);

          if (extra.file) {
            var playlist = [];
            var first = toPlayElement(item);

            if (item.season) {
              items.forEach(function (elem) {
                playlist.push(toPlayElement(elem));
              });
            } else {
              playlist.push(first);
            }

            if (playlist.length > 1) first.playlist = playlist;
            Lampa.Player.play(first);
            Lampa.Player.playlist(playlist);
            item.mark();
          } else Lampa.Noty.show(Lampa.Lang.translate(get_links_wait ? 'online_waitlink' : 'online_nolink'));
        },
        onContextMenu: function onContextMenu(item, html, data, call) {
          call(getFile(item, item.quality));
        }
      });
    }
  }

  function rezka(component, _object) {
    var network = new Lampa.Reguest();
    var extract = {};
    var prox = component.proxy('hdrezka');
    var embed = prox ? prox + 'http://voidboost.tv/' : 'https://voidboost.tv/';
    var object = _object;
    var select_id = '';
    var filter_items = {};
    var choice = {
      season: 0,
      voice: 0,
      order: 0,
      voice_name: ''
    };

    this.searchByKinopoisk = function (_object, kp_id) {
      object = _object;
      select_id = kp_id;
      getFirstTranlate(kp_id, function (voice) {
        getFilm(kp_id, voice);
      });
    };
    this.extendChoice = function (saved) {
      Lampa.Arrays.extend(choice, saved, true);
    };
    this.reset = function () {
      component.reset();
      choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };
      component.loading(true);
      getFirstTranlate(select_id, function (voice) {
        getFilm(select_id, voice);
      });
      component.saveChoice(choice);
    };
    this.filter = function (type, a, b) {
      choice[a.stype] = b.index;
      if (a.stype == 'voice') choice.voice_name = filter_items.voice[b.index];
      component.reset();
      filter();
      component.loading(true);
      choice.voice_token = extract.voice[choice.voice].token;
      getFilm(select_id, choice.voice_token);
      component.saveChoice(choice);
      setTimeout(component.closeFilter, 10);
    };
    this.destroy = function () {
      network.clear();
      extract = null;
    };
    function getSeasons(voice, call) {
      var url = embed + 'serial/' + voice + '/iframe?h=gidonline.io';
      network.clear();
      network.timeout(10000);
      network.silent(url, function (str) {
        extractData(str);
        call();
      }, function (a, c) {
        component.doesNotAnswer();
      }, false, {
        dataType: 'text'
      });
    }
    function getChoiceVoice() {
      var res = extract.voice[0];

      if (choice.voice_token) {
        extract.voice.forEach(function (voice) {
          if (voice.token === choice.voice_token) res = voice;
        });
      }

      return res;
    }
    function getFirstTranlate(id,call) {
      network.clear();
      network.timeout(10000);
      
      network.silent(embed + 'embed/' + id, function (str) {
        extractData(str);
        if (extract.voice.length) call(getChoiceVoice().token);
        else component.doesNotAnswer(object.movie.title);
      }, function (a, c) {
        component.doesNotAnswer(a.status == 404 && a.responseText && (a.responseText.indexOf('Видео не найдено') !== -1 ||  a.responseText.indexOf('Not Found') !== -1) ? object.movie.title : '');
      }, false, {
        dataType: 'text'
      });
    }
    function getEmbed(url) {
      network.clear();
      network.timeout(10000);
      network.silent(url, function (str) {
        component.loading(false);
        extractData(str);
        filter();
        append();
      }, function (a, c) {
        component.doesNotAnswer();
      }, false, {
        dataType: 'text'
      });
    }
    function getFilm(id, voice) {
      var url = embed;
      if (voice) {
        if (extract.season.length) {
          var ses = extract.season[Math.min(extract.season.length - 1, choice.season)].id;
          url += 'serial/' + voice + '/iframe?s=' + ses + '&h=gidonline.io';
          return getSeasons(voice, function () {
            var check = extract.season.filter(function (s) {
              return s.id == ses;
            });

            if (!check.length) {
              choice.season = extract.season.length - 1;
              url = embed + 'serial/' + voice + '/iframe?s=' + extract.season[choice.season].id + '&h=gidonline.io';
            }

            getEmbed(url);
          });
        } else {
          url += 'movie/' + voice + '/iframe?h=gidonline.io';
          getEmbed(url);
        }
      } else {
        url += 'embed/' + id;
        getEmbed(url);
      }
    }
    function filter() {
      filter_items = {
        season: extract.season.map(function (v) {
          return v.name;
        }),
        voice: extract.season.length ? extract.voice.map(function (v) {
          return v.name;
        }) : []
      };

      if (choice.voice_name) {
        var inx = filter_items.voice.map(function (v) {
          return v.toLowerCase();
        }).indexOf(choice.voice_name.toLowerCase());
        if (inx == -1) choice.voice = 0;
        else if (inx !== choice.voice) {
          choice.voice = inx;
        }
      }
      
      if(!extract.season[choice.season]) choice.season = 0;

      component.filter(filter_items, choice);
    }
    function parseSubtitles(str) {
      var subtitles = [];
      var subtitle = str.match("'subtitle': '(.*?)'");

      if (subtitle) {
        subtitles = component.parsePlaylist(subtitle[1]).map(function (item) {
          return {
            label: item.label,
            url: item.links[0]
          };
        });
      }

      return subtitles.length ? subtitles : false;
    }
    function extractItems(str) {
      try {
        var items = component.parsePlaylist(str).map(function (item) {
          var quality = item.label.match(/(\d\d\d+)p/);
          var links;

          links = item.links.filter(function (url) {
            return /\.mp4$/i.test(url);
          });
          
          if (!links.length) links = item.links;
          return {
            label: item.label,
            quality: quality ? parseInt(quality[1]) : NaN,
            file: links[0]
          };
        });
        items.sort(function (a, b) {
          if (b.quality > a.quality) return 1;
          if (b.quality < a.quality) return -1;
          if (b.label > a.label) return 1;
          if (b.label < a.label) return -1;
          return 0;
        });
        return items;
      } catch (e) {}

      return [];
    }
    function getStream(element, call, error) {
      if (element.stream) return call(element.stream);
      var url = embed;

      if (element.season) {
        url += 'serial/' + element.voice.token + '/iframe?s=' + element.season + '&e=' + element.episode + '&h=gidonline.io';
      } else {
        url += 'movie/' + element.voice.token + '/iframe?h=gidonline.io';
      }

      network.clear();
      network.timeout(5000);
      network["native"](url, function (str) {
        var videos = str.match("'file': '(.*?)'");

        if (videos) {
          var video = decode(videos[1]),
              file = '',
              quality = false;
          var items = extractItems(video);

          if (items && items.length) {
            file = items[0].file;
            quality = {};
            items.forEach(function (item) {
              quality[item.label] = item.file;
            });
            var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
            if (quality[preferably]) file = quality[preferably];
          }

          if (file) {
            element.stream = file;
            element.qualitys = quality;
            element.subtitles = parseSubtitles(str);
            call(element.stream);
          } else error();
        } else error();
      }, error, false, {
        dataType: 'text'
      });
    }
    function decode(data) {
      if (data.charAt(0) !== '#') return data;

      var enc = function enc(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
          return String.fromCharCode('0x' + p1);
        }));
      };

      var dec = function dec(str) {
        return decodeURIComponent(atob(str).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
      };

      var trashList = ['$$$####!!!!!!!', '^^^^^^##@', '@!^^!@#@@$$$$$', '^^#@@!!@#!$', '@#!@@@##$$@@'];
      var x = data.substring(2);
      trashList.forEach(function (trash) {
        x = x.replace('//_//' + enc(trash), '');
      });

      try {
        x = dec(x);
      } catch (e) {
        x = '';
      }

      return x;
    }
    function extractData(str) {
      extract.voice = [];
      extract.season = [];
      extract.episode = [];
      str = str.replace(/\n/g, '');
      var voices = str.match('<select name="translator"[^>]+>(.*?)</select>');
      var sesons = str.match('<select name="season"[^>]+>(.*?)</select>');
      var episod = str.match('<select name="episode"[^>]+>(.*?)</select>');

      if (sesons) {
        var select = $('<select>' + sesons[1] + '</select>');
        $('option', select).each(function () {
          extract.season.push({
            id: $(this).attr('value'),
            name: $(this).text()
          });
        });
      }

      if (voices) {
        var _select = $('<select>' + voices[1] + '</select>');

        $('option', _select).each(function () {
          var token = $(this).attr('data-token');

          if (token) {
            extract.voice.push({
              token: token,
              name: $(this).text(),
              id: $(this).val()
            });
          }
        });
      }

      if (episod) {
        var _select2 = $('<select>' + episod[1] + '</select>');

        $('option', _select2).each(function () {
          extract.episode.push({
            id: $(this).attr('value'),
            name: $(this).text()
          });
        });
      }
    }
    function append() {
      component.reset();
      var items = [];

      if (extract.season.length) {
        extract.episode.forEach(function (episode) {
          items.push({
            title: episode.name,
            quality: '720p ~ 1080p',
            season: extract.season[Math.min(extract.season.length - 1, choice.season)].id,
            episode: parseInt(episode.id),
            info: extract.voice[choice.voice].name,
            voice: extract.voice[choice.voice],
            voice_name: extract.voice[choice.voice].name
          });
        });
      } else {
        extract.voice.forEach(function (voice) {
          items.push({
            title: voice.name.length > 3 ? voice.name : object.movie.title,
            quality: '720p ~ 1080p',
            voice: voice,
            info: '',
            voice_name: voice.name
          });
        });
      }

      component.draw(items, {
        onEnter: function onEnter(item, html) {
          getStream(item, function (stream) {
            var first = {
              url: stream,
              timeline: item.timeline,
              quality: item.qualitys,
              title: item.title
            };
            Lampa.Player.play(first);

            if (item.season) {
              var playlist = [];
              items.forEach(function (elem) {
                var cell = {
                  url: function url(call) {
                    getStream(elem, function (stream) {
                      cell.url = stream;
                      cell.quality = elem.qualitys;
                      elem.mark();
                      call();
                    }, function () {
                      cell.url = '';
                      call();
                    });
                  },
                  timeline: elem.timeline,
                  title: elem.title
                };
                if (elem == item) cell.url = stream;
                playlist.push(cell);
              });
              Lampa.Player.playlist(playlist);
            } else {
              Lampa.Player.playlist([first]);
            }

            if (item.subtitles && Lampa.Player.subtitles) Lampa.Player.subtitles(item.subtitles);
            item.mark();
          }, function () {
            Lampa.Noty.show(Lampa.Lang.translate('online_nolink'));
          });
        },
        onContextMenu: function onContextMenu(item, html, data, call) {
          getStream(item, function (stream) {
            call({
              file: stream,
              quality: item.qualitys
            });
          });
        }
      });
    }
  }

	function kinobase(component, _object) {
		var network = new Lampa.Reguest();
		var extract = [];
		var is_playlist = false;
		var quality_type = '';
		var translation = '';
		var embed = component.proxy('kinobase') + 'https://kinobase.org/';
		var object = _object;
		var data;
		var select_title = '';
		var select_id = '';
		var filter_items = {};
		var voic = '';
		var wait_similars;
		var choice = {
			season: 0,
			voice: 0, 
			order: 0,
			voice_name:''
		};
	
		this.search = function (_object, sim) {
      if (wait_similars && sim) return getPage(sim[0].link);
    };
		this.searchByTitle = function (_object, query) {
      object = _object;
      select_title = query;
      var url = embed + "search?query=" + encodeURIComponent(component.cleanTitle(select_title));
      network.clear();
      network.timeout(1000 * 10);
      network.silent(url, function (str) {
        str = str.replace(/\n/g, '');
        var links = object.movie.number_of_seasons ? str.match(/<a href="\/serial\/([^"]*)" class="link"[^>]*>(.*?)<\/a>/g) : str.match(/<a href="\/film\/([^"]*)" class="link"[^>]*>(.*?)<\/a>/g);
        var search_date = object.search_date || object.movie.release_date || object.movie.first_air_date || object.movie.last_air_date || '0000';
        var search_year = parseInt((search_date + '').slice(0, 4));

        if (links) {
          var items = links.map(function (l) {
            var link = $(l),
                titl = link.attr('title') || link.text() || '';
            var year;
            var found = titl.match(/^(.*)\((\d{4})\)$/);

            if (found) {
              year = parseInt(found[2]);
              titl = found[1].trim();
            }

            return {
              year: year,
              title: titl,
              link: link.attr('href')
            };
          });
          var cards = items.filter(function (c) {
            return !c.year || !search_year || c.year > search_year - 2 && c.year < search_year + 2;
          });

          if (cards.length > 1) {
            var tmp = cards.filter(function (c) {
              return c.year == search_year;
            });
            if (tmp.length) cards = tmp;
          }

          if (cards.length > 1) {
            var _tmp = cards.filter(function (c) {
              return c.title == select_title;
            });

            if (_tmp.length) cards = _tmp;
          }

          if (cards.length == 1) getPage(cards[0].link);
          else if (items.length) {
            wait_similars = true;
            var similars = [];
            links.forEach(function (l) {
              var link = $(l),
                  titl = link.attr('title') || link.text();
                  type = link.attr('href').indexOf('serial') > -1 ? 'serial' : 'film';
              similars.push({
                title: titl,
                type: type, 
                link: link.attr('href')
              });
            });
            component.similars(similars);
            component.loading(false);
          } else component.doesNotAnswer(select_title);
        } else component.doesNotAnswer(select_title);
      }, function (a, c) {
        component.doesNotAnswer();
      }, false, {
        dataType: 'text'
      });
    };
		this.extendChoice = function (saved) {
			Lampa.Arrays.extend(choice, saved, true);
		};
		this.reset = function () {
			component.reset();
			choice = {
				season: 0,
				voice: 0, 
				order: 0
			};
			filter();
			append(filtred());
		};
		this.filter = function (type, a, b) {
			choice[a.stype] = b.index;
			component.reset();
			filter();
			append(filtred());
		};
		this.destroy = function () {
			network.clear();
			extract = null;
		};
		function filter() {
			filter_items = {
				season: [],
				voice: [],
				order: []
			};
			if (is_playlist) {
			  component.order.forEach(function (i){
					filter_items.order.push(i.title);
				});
				extract.forEach(function (item, i) {
					if (item.playlist) {
						filter_items.season.push(item.comment);
						if (i == choice.season) {
							item.playlist.forEach(function (eps) {
								if (eps.file) {
									component.parsePlaylist(eps.file).forEach(function (el) {
										if (el.voice && filter_items.voice.indexOf(el.voice) == -1) {
											filter_items.voice.push(el.voice);
										}
									});
								}
							});
						}
					} else if (item.file) {
						component.parsePlaylist(item.file).forEach(function (el) {
							if (el.voice && filter_items.voice.indexOf(el.voice) == -1) {
								filter_items.voice.push(el.voice);
							}
						});
					}
				});
			}
			if (!filter_items.season[choice.season]) choice.season = 0;
			if (!filter_items.voice[choice.voice]) choice.voice = 0;
			component.filter(filter_items, choice);
		}
		function filtred() {
			var filtred = [];
			if (is_playlist) {
				var playlist = extract;
				var season = object.movie.number_of_seasons && 1;
				if (extract[choice.season] && extract[choice.season].playlist) {
					playlist = extract[choice.season].playlist;
					season = parseInt(extract[choice.season].comment);
					if (isNaN(season)) season = 1;
				}
				playlist.forEach(function (eps, episod) {
					var items = extractItems(eps.file, filter_items.voice[choice.voice]);
					if (items.length) {
						var alt_voice = eps.comment.match(/\d+ серия (.*)$/i);
						var info = items[0].voice || (alt_voice && alt_voice[1].trim()) || translation;
						if (info == eps.comment) info = '';
						filtred.push({
							file: eps.file,
							title: eps.comment,
							quality: (quality_type ? quality_type + ' - ' : '') + items[0].quality + 'p',
							season: season,
							episode: episod + 1,
							info: info ? info : '',
							voice_name: info,
							subtitles: parseSubs(eps.subtitle || '')
						});
					}
				});
			} else {
				filtred = extract;
			}
			return component.order[choice.order].id == 'invers' ? filtred.reverse() : filtred;
		}
		function parseSubs(vod) {
			var subtitles = component.parsePlaylist(vod).map(function (item) {
				return {
					label: item.label,
					url: item.links[0]
				};
			});
			return subtitles.length ? subtitles : false;
		}
		function extractData(str, page) {
			var quality_match = page.match(/<li><b>Качество:<\/b>([^<,]+)<\/li>/i);
			var translation_match = page.match(/<li><b>Перевод:<\/b>([^<,]+)<\/li>/i);
			quality_type = quality_match ? quality_match[1].trim() : '';
			translation = translation_match ? translation_match[1].trim() : '';
			var vod = str.split('|');
			if (vod[0] == 'file') {
				var file = vod[1];
				var found = [];
				var subtiles = parseSubs(vod[2]);
				if (file) {
					var voices = {};
					component.parsePlaylist(file).forEach(function (item) {
						var prev = voices[item.voice || ''];
						var quality_str = item.label.match(/(\d\d\d+)p/);
						var quality = quality_str ? parseInt(quality_str[1]) : NaN;
						if (!prev || quality > prev.quality) {
							voices[item.voice || ''] = {
								quality: quality
							};
						}
					});
					for (var voice in voices) {
						var el = voices[voice];
						found.push({
							file: file,
							title: voice || translation || object.movie.title,
							quality: (quality_type ? quality_type + ' - ' : '') + el.quality + 'p',
							info: '',
							voice: voice,
							voice_name: voice,
							subtitles: subtiles
						});
					}
				}
				extract = found;
				is_playlist = false;
			} else if (vod[0] == 'pl') {
				extract = Lampa.Arrays.decodeJson(vod[1], []);
				is_playlist = true;
			} else component.doesNotAnswer(select_title);
		}
		function getPage(url) {
			network.clear();
			network.timeout(1000 * 10);
			network["native"](embed + url, function (str) {
				str = str.replace(/\n/g, '');
				var voices = str.match('<ul class="list-unstyled details">(.*?)</ul>');
				$(voices, 'li').each(function (r, a) {
					var vsrt = a.match('<li><b>Перевод:</b>(.*?)</li>');
					voic = vsrt && vsrt[1];
				});
				var MOVIE_ID = str.match('var MOVIE_ID = ([^;]+);');
				var IDENTIFIER = str.match('var IDENTIFIER = "([^"]+)"');
				var PLAYER_CUID = str.match('var PLAYER_CUID = "([^"]+)"');
				if (MOVIE_ID && IDENTIFIER && PLAYER_CUID) {
					select_id = MOVIE_ID[1];
					var identifier = IDENTIFIER[1];
					var player_cuid = PLAYER_CUID[1];
					var data_url = "user_data";
					data_url = Lampa.Utils.addUrlComponent(data_url, "page=movie");
					data_url = Lampa.Utils.addUrlComponent(data_url, "movie_id=" + select_id);
					data_url = Lampa.Utils.addUrlComponent(data_url, "cuid=" + player_cuid);
					data_url = Lampa.Utils.addUrlComponent(data_url, "device=DESKTOP");
					data_url = Lampa.Utils.addUrlComponent(data_url, "_=" + Date.now());
					network.clear();
					network.timeout(1000 * 10);
					network["native"](embed + data_url, function (user_data) {
						if (user_data.vod_hash && user_data.vod_time) {
							var file_url = "vod/" + select_id;
							file_url = Lampa.Utils.addUrlComponent(file_url, "identifier=" + identifier);
							file_url = Lampa.Utils.addUrlComponent(file_url, "player_type=new");
							file_url = Lampa.Utils.addUrlComponent(file_url, "file_type=mp4");
							file_url = Lampa.Utils.addUrlComponent(file_url, "st=" + user_data.vod_hash);
							file_url = Lampa.Utils.addUrlComponent(file_url, "e=" + user_data.vod_time);
							file_url = Lampa.Utils.addUrlComponent(file_url, "_=" + Date.now());
							network.clear();
							network.timeout(1000 * 10);
							network["native"](embed + file_url, function (files) {
								if (files.indexOf('404') > -1) return component.doesNotAnswer(select_title);
								component.loading(false);
								extractData(files, str);
								filter();
								append(filtred());
							}, function (a, c) {
								component.doesNotAnswer();
							}, false, {
								dataType: 'text'
							});
						} else component.doesNotAnswer(Lampa.Lang.translate('torrent_parser_no_hash'));
					}, function (a, c) {
						component.doesNotAnswer();
					});
				} else component.doesNotAnswer();
			}, function (a, c) {
				component.doesNotAnswer();
			}, false, {
				dataType: 'text'
			});
		}
		function extractItems(str, voice) {
			try {
				var list = component.parsePlaylist(str);
				if (voice) {
					var tmp = list.filter(function (el) {
						return el.voice == voice;
					});
					if (tmp.length) {
						list = tmp;
					} else {
						list = list.filter(function (el) {
							return typeof el.voice == 'undefined';
						});
					}
				}
				var items = list.map(function (item) {
					var quality = item.label.match(/(\d\d\d+)p/);
					return {
						label: item.label,
						voice: item.voice,
						quality: quality ? parseInt(quality[1]) : NaN,
						file: item.links[0]
					};
				});
				items.sort(function (a, b) {
					if (b.quality > a.quality) return 1;
					if (b.quality < a.quality) return -1;
					if (b.label > a.label) return 1;
					if (b.label < a.label) return -1;
					return 0;
				});
				return items;
			} catch (e) {}
			return [];
		}
		function getFile(element) {
			var file = '',
				quality = false;
			var items = extractItems(element.file, element.voice);
			if (items && items.length) {
				file = items[0].file;
				quality = {};
				items.forEach(function (item) {
					quality[item.label] = item.file;
				});
				var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
				if (quality[preferably]) file = quality[preferably];
			}
			element.stream = file;
			element.qualitys = quality;
			return {
				file: file,
				quality: quality
			};
		}
		function toPlayElement(element) {
      getFile(element);
      var play = {
        url: element.stream,
        timeline: element.timeline,
        title: element.title,
        subtitles: element.subtitles,
        quality: element.qualitys,
        callback: element.mark
      };
      return play;
    }
    function append(items) {
      component.reset();
      component.draw(items, {
        similars: wait_similars,
        onEnter: function onEnter(item, html) {
          getFile(item);

          if (item.stream) {
            var playlist = [];
            var first = toPlayElement(item);

            if (item.season) {
              items.forEach(function (elem) {
                playlist.push(toPlayElement(elem));
              });
            } else {
              playlist.push(first);
            }

            if (playlist.length > 1) first.playlist = playlist;
            Lampa.Player.play(first);
            Lampa.Player.playlist(playlist);
            item.mark();
          } else Lampa.Noty.show(Lampa.Lang.translate('online_nolink'));
        },
        onContextMenu: function onContextMenu(item, html, data, call) {
          call(getFile(item));
        }
      });
    }
	}

	function collaps(component, _object) {
		var network = new Lampa.Reguest();
		var extract = {};
		var prox = component.proxy('collaps');
		var embed = prox ? prox + 'https://api.topdbltj.ws/embed/' : 'https://api.delivembd.ws/embed/';
		var select_title = '';
		var filter_items = {};
		var prefer_dash = Lampa.Storage.field('online_dash') === true;
		var choice = {
			season: 0,
			voice: 0, 
			order: 0
		};

		this.searchByKinopoisk = function (_object, kp_id) {
			select_title = _object.search;
      var url = embed + 'kp/' + kp_id;
			network.clear();
      network.timeout(10000);
			network.silent(url, function (str) {
				if (str) {
					parse(str);
				} else component.doesNotAnswer(select_title);
				component.loading(false);
			}, function (a, c) {
				component.doesNotAnswer(a.status == 404 && a.responseText && a.responseText.indexOf('видео недоступно') !== -1 ? select_title : '');
			}, false, {
				dataType: 'text'
			});
		};
		this.extendChoice = function (saved) {
			Lampa.Arrays.extend(choice, saved, true);
		};
		this.reset = function () {
			component.reset();
			choice = {
				season: 0,
				voice: 0, 
				order: 0
			};
			filter();
			append(filtred());
			component.saveChoice(choice);
		};
		this.filter = function (type, a, b) {
			choice[a.stype] = b.index;
			component.reset();
			filter();
			append(filtred());
			component.saveChoice(choice);
		};
		this.destroy = function () {
			network.clear();
			extract = null;
		};
		function parse(str) {
			str = str.replace(/\n/g, '');
			var find = str.match('makePlayer\\({(.*?)}\\);');
			var json;
			try {
				json = find && eval('({' + find[1] + '})');
			} catch (e) {}
			if (json) {
				extract = json;
				if (extract.playlist && extract.playlist.seasons) {
					extract.playlist.seasons.sort(function (a, b) {
						return a.season - b.season;
					});
				}
				filter();
				append(filtred());
			} else component.doesNotAnswer(select_title);
		}
		function filter() {
			filter_items = {
				season: [],
				voice: [],
				order: []
			};
			if (extract.playlist && extract.playlist.seasons) {
				component.order.forEach(function (i){
					filter_items.order.push(i.title);
				});
				extract.playlist.seasons.forEach(function (season) {
					filter_items.season.push(Lampa.Lang.translate('torrent_serial_season') + ' ' + season.season);
				});
			}
			
			filter_items.season.sort(function(a,b){
        var n_a = parseInt(a.replace(/\D/g,''));
        var n_b = parseInt(b.replace(/\D/g,''));
        if(n_a > n_b) return 1;
        else if(n_a < n_b) return -1;
        else return 0;
      });
			
			if (!filter_items.season[choice.season]) choice.season = 0;
			component.filter(filter_items, choice);
		}
		function filtred() {
			var filtred = [];
			if (extract.playlist) {
				extract.playlist.seasons.forEach(function (season, i) {
					if((season.season - 1) == choice.season) {
						season.episodes.forEach(function (episode) {
							var resolution = Lampa.Arrays.getKeys(extract.qualityByWidth).pop();
							var max_quality = resolution ? extract.qualityByWidth[resolution] || 0 : '';
							var audio_tracks = episode.audio.names.map(function (name) {
								return {
									language: name
								};
							});
							filtred.push({
								file: prefer_dash && episode.dash || episode.hls,
								episode: parseInt(episode.episode),
								season: parseInt(season.season),
								title: episode.title,
								quality: max_quality ? max_quality + 'p' : '',
								voice: episode.audio.names.join('<br>'),
								info: episode.audio.names.slice(0, 5).join(', '),
								subtitles: episode.cc ? episode.cc.map(function (c) {
									return {
										label: c.name,
										url: c.url
									};
								}) : false,
								audio_tracks: audio_tracks.length ? audio_tracks : false
							});
						});
					}
				});
			} else if (extract.source) {
				var resolution = Lampa.Arrays.getKeys(extract.qualityByWidth).pop();
				var max_quality = extract.qualityByWidth ? extract.qualityByWidth[resolution] || 0 : 0;
				var audio_tracks = extract.source.audio.names.map(function (name) {
					return {
						language: name
					};
				});
				filtred.push({
					file: prefer_dash && extract.source.dash || extract.source.hls,
					title: extract.title,
					quality: max_quality ? max_quality + 'p' : '',
					info: extract.source.audio.names.slice(0, 5).join(', '),
					voice: extract.source.audio.names.join('<br>'),
					subtitles: extract.source.cc ? extract.source.cc.map(function (c) {
						return {
							label: c.name,
							url: c.url
						};
					}) : false,
					audio_tracks: audio_tracks.length ? audio_tracks : false
				});
			}
			return component.order[choice.order].id == 'invers' ? filtred.reverse() : filtred;
		}
    function append(items) {
      component.reset();
      component.draw(items, {
        onEnter: function onEnter(item, html) {
          if (item.file) {
            var playlist = [];
            var first = {
              url: item.file,
              timeline: item.timeline,
              title: item.title,
              subtitles: item.subtitles, 
              translate: {
                tracks: item.audio_tracks
              }
            };

            if (item.season) {
              items.forEach(function (elem) {
                playlist.push({
                  title: elem.title,
                  url: elem.file,
                  timeline: elem.timeline,
                  subtitles: elem.subtitles,
                  translate: {
                    tracks: elem.audio_tracks
                  },
                  callback: function callback() {
                    elem.mark();
                  }
                });
              });
            } else {
              playlist.push(first);
            }

            if (playlist.length > 1) first.playlist = playlist;
            Lampa.Player.play(first);
            Lampa.Player.playlist(playlist);
            item.mark();
          } else Lampa.Noty.show(Lampa.Lang.translate('online_nolink'));
        },
        onContextMenu: function onContextMenu(item, html, data, call) {
          call({
            file: item.file
          });
        }
      });
    }
	}

	function filmix(component, _object) {
		var network = new Lampa.Reguest();
		var extract = {};
		var results = [];
		var object = _object;
		var embed = 'http://filmixapp.cyou/api/v2/';
		var select_title = '';
		var filter_items = {};
		var wait_similars;
		var count = 0;
		var choice = {
			season: 0,
			voice: 0,
			order: 0,
			voice_name: ''
		};
		var token = Lampa.Storage.get('filmix_token', 'aaaabbbbccccddddeeeeffffaaaabbbb');
		if (!window.filmix) {
			window.filmix = {
				max_qualitie: 720,
				is_max_qualitie: false
			};
		}
		var dev_token = 'user_dev_apk=2.0.1&user_dev_id=&user_dev_name=Xiaomi&user_dev_os=11&user_dev_token=' + token + '&user_dev_vendor=Xiaomi';
		
		this.search = function (_object, sim) {
      if (wait_similars) this.find(sim[0].id);
    };
		this.searchByTitle = function (_object, query) {
			var _this = this;
			object = _object;
			select_title = object.search || query;
			var search_date = object.search_date || (object.movie.number_of_seasons ? object.movie.first_air_date : object.movie.release_date) || '0000';
			var search_year = parseInt((search_date + '').slice(0, 4));
			var orig = object.movie.original_title || object.movie.original_name;
			var clean_title = component.cleanTitle(select_title).replace(/\b(\d\d\d\d+)\b/g, '+$1');
      if (search_year) clean_title = clean_title.replace(new RegExp(' \\+(' + search_year + ')$'), ' $1');
			var url = embed + 'search';
			url = Lampa.Utils.addUrlComponent(url, 'story=' + encodeURIComponent(clean_title));
			url = Lampa.Utils.addUrlComponent(url, dev_token);
			network.clear();
			network.timeout(15000);
			network.silent(url, function (json) {
				if (json.length == 0) component.doesNotAnswer(select_title);
				else {
  		    var cards = json.filter(function (c) {
            if (!c.year && c.alt_name) c.year = parseInt(c.alt_name.split('-').pop());
            return !c.year || !search_year || c.year > search_year - 2 && c.year < search_year + 2;
          });
  
          if (cards.length > 1) {
            var tmp = cards.filter(function (c) {
              return c.year == search_year;
            });
            if (tmp.length) cards = tmp;
          }
  
          if (cards.length > 1) {
            var _tmp = cards.filter(function (c) {
              return c.original_title == orig;
            });
  
            if (_tmp.length) cards = _tmp;
          }
  
          if (cards.length > 1) {
            var _tmp2 = cards.filter(function (c) {
              return c.title == select_title;
            });
  
            if (_tmp2.length) cards = _tmp2;
          }
    						
					if (cards.length == 1) _this.find(cards[0].id);
					else if (json.length) {
						wait_similars = true;
						cards.forEach(function (c) {
						  c.type = c.last_episode?'serial':'film';
						  c.seasons_count = c.last_episode.season;
						  c.episodes_count = c.last_episode.episode;
						  c.translations = c.last_episode.translation;
						});
						component.similars(cards);
						component.loading(false);
					} else component.doesNotAnswer(select_title);
				}
			}, function (a, c) {
				component.doesNotAnswer();
			});
		};
		
		this.find = function (filmix_id) {
			var url = embed;
			if (!window.filmix.is_max_qualitie && token) {
				window.filmix.is_max_qualitie = true;
				network.clear();
				network.timeout(10000);
				network.silent(url + 'user_profile?' + dev_token, function (found) {
					if (found && found.user_data) {
						if (found.user_data.is_pro) window.filmix.max_qualitie = 1080;
						if (found.user_data.is_pro_plus) window.filmix.max_qualitie = 2160;
					}
					end_search(filmix_id);
				});
			} else end_search(filmix_id);

			function end_search(filmix_id, pr) {
				network.clear();
				network.timeout(10000);
				network.silent(window.filmix.is_max_qualitie ? (pr&&'http://prox.lampa.stream/'||'') +url + 'post/' + filmix_id + '?' +dev_token : url + 'post/' + filmix_id, function (found) {
					if (found && Lampa.Arrays.getKeys(found).length && (found.player_links.movie.length || Lampa.Arrays.getKeys(found.player_links.playlist).length)) {
						if(count == 0 && found.player_links.movie[0] && found.player_links.movie[0].translation.indexOf('Заблокирован') == 0) {
					    count++;
					    end_search(filmix_id,true);
						} else {
  						success(found);
  						component.loading(false);
  					}
					} else component.doesNotAnswer(select_title);
				}, function (a, c) {
					component.doesNotAnswer();
				});
			}
		};
		this.extendChoice = function (saved) {
			Lampa.Arrays.extend(choice, saved, true);
		};

		this.reset = function () {
			component.reset();
			choice = {
				season: 0,
				voice: 0,
				order: 0,
				voice_name: ''
			};
			filter();
			extractData(results);
			append(filtred());
		};

		this.filter = function (type, a, b) {
			choice[a.stype] = b.index;
			if (a.stype == 'voice') choice.voice_name = filter_items.voice[b.index];
			component.reset();
			filter();
			extractData(results);
			append(filtred());
		};

		this.destroy = function () {
			network.clear();
			results = null;
		};
	
		function success(json) {
			results = json;
			extractData(json);
			filter();
			append(filtred());
		}

		function extractData(json) {
  		var last_episode = json.last_episode;
  		var player_links = json.player_links;
  		var _max_quality = window.filmix.max_qualitie;
  		if (player_links.playlist && Object.keys(player_links.playlist).length > 0) {
  			results.serial = 1;
  			results.translations = [];
  			results.seasons = [];
  			Object.entries(player_links.playlist).forEach(function (seasons) {
  				var keys = Math.abs(seasons[0]);
          if (results.seasons.indexOf(keys) == -1) results.seasons.push(keys);
  				//console.log('keys', keys, 'season', seasons[1]);
  				Object.entries(seasons[1]).forEach(function (translations) {
  					var keyt, translation = translations[0];
  					//console.log('keyt', keyt, 'translation', translation);
  					if (results.translations.indexOf(translation) == -1) {
  						results.translations.push(translation);
  						keyt = results.translations.indexOf(translation);
  						extract[keyt] = {
  							json: [],
  							file: "",
  							translation_id: keyt,
  							translation: translation
  						};
  					} else keyt = results.translations.indexOf(translation);
  					var folder = [];
  					Object.entries(translations[1]).forEach(function (episodes) {
  						var keye = episodes[0],
  							episode = episodes[1];
  						//console.log('keye', keye, 'episode', episode);
  						var qualities = episode.qualities.filter(function (elem) {
  							return parseInt(elem) <= _max_quality && parseInt(elem) !== 0;
  						}).sort(function (a, b) {
                return b - a;
              });
  						var qualitie = Math.max.apply(null, qualities);
  						var link = episode.link;
  						folder[keye] = {
  							id: keys + '_' + keye,
  							comment: keye +' '+ Lampa.Lang.translate('torrent_serial_episode') +' <i>' + qualitie + '</i>',
  							file: link,
  							episode: keye,
  							season: keys,
  							rip: json.rip.split(' ')[0],
  							quality: qualitie,
  							qualities: qualities,
  							translation: keyt, //translation,
  						};
  					});
  					extract[keyt].json[keys] = {
  						id: keys,
  						comment: keys +' '+Lampa.Lang.translate('torrent_serial_season'),
  						folder: folder,
  						translation: keyt
  					};
  				});
  			});
  		} else if (player_links.movie && player_links.movie.length > 0) {
  			results.serial = 0;
  			Object.entries(player_links.movie).forEach(function (translations) {
  				var translation = translations[0],
  					movie = translations[1];
  				//console.log('translation', translation, 'movie', movie);
  				var qualities = movie.link.match(/.+\[(.+[\d]),?\].+/i);
  				if (qualities) qualities = qualities[1].split(",").filter(function (elem) {
  					return parseInt(elem) <= _max_quality && parseInt(elem) !== 0;
  				}).sort(function (a, b) {
            return b - a;
          });
  				var qualitie = Math.max.apply(null, qualities);
  				var link = movie.link;
  				extract[translation] = {
  					json: {},
  					file: link,
  					translation: movie.translation,
  					rip: json.rip.split(' ')[0],
  					quality: qualitie,
  					qualities: qualities
  				};
  			});
  		}
  	}

		function getFile(element, max_quality) {
			var translat = extract[element.translation];
			var id = element.season + '_' + element.episode;
			var file = '';
			var eps = {};
			var quality = false;
			if (translat) {
				if (element.season)
					for (var i in translat.json) {
						var elem = translat.json[i];
						if (elem.folder)
							for (var f in elem.folder) {
								var folder = elem.folder[f];
								if (folder.id == id) {
									eps = folder;
									break;
								}
							} else {
								if (elem.id == id) {
									eps = elem;
									break;
								}
							}
					} else eps = translat;
			}
			file = eps.file;			if (file) {
				quality = {};
				if (eps.qualities) {
					eps.qualities.forEach(function (q) {
						var files = element.season ? file.replace(/%s(\.mp4)/i, q + "$1") : file.replace(/\[[\d,]*\](\.mp4)/i, q + "$1"); 
						quality[q + 'p'] = files;
					});
					file = element.season ? file.replace(/%s(\.mp4)/i, eps.qualities[0] + "$1") : file.replace(/\[[\d,]*\](\.mp4)/i, eps.qualities[0] + "$1"); 
				}
				var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
				if (quality[preferably]) file = quality[preferably];
			}
			return {
        file: file,
        quality: quality
      };
		}
	
		function filter() {
			filter_items = {
				season: [],
				voice: [],
				order: [],
				voice_info: []
			};
      if (results.serial == 1) {
        component.order.forEach(function (i){
					filter_items.order.push(i.title);
				});
  			results.seasons.forEach(function (season) {
          filter_items.season.sort(function(a, b){
            return a - b;
          }).push(Lampa.Lang.translate('torrent_serial_season') + ' ' + (season));
        });

        results.translations.forEach(function (translation, keyt) {
          var season = filter_items.season[choice.season].split(' ').pop();
          if (extract[keyt].json[season]) {
            if (filter_items.voice.indexOf(translation) == -1) {
              filter_items.voice[keyt] = translation;
              filter_items.voice_info[keyt] = { 
                id: keyt
              };
            }
          }
        });
          
  			if (filter_items.voice_info.length > 0 && !filter_items.voice_info[choice.voice]) {
  				choice.voice = undefined;
  				filter_items.voice_info.forEach(function (voice_info) {
  					if (choice.voice == undefined) choice.voice = voice_info.id;
  				});
  			}
  		}
			component.filter(filter_items, choice);
		}
	
		function filtred() {
  		var filtred = [];
  		if (results.player_links.playlist && Object.keys(results.player_links.playlist).length > 0) {
  			for (var keym in extract) {
  				var serial = extract[keym];
  				for (var keye in serial.json) {
  					var episode = serial.json[keye];
  					if (episode.id == choice.season+1) {
  						episode.folder.forEach(function (media) {
  							if (media.translation == filter_items.voice_info[choice.voice].id) {
  								filtred.push({
  									episode: parseInt(media.episode),
  									season: media.season,
  									title: Lampa.Lang.translate('torrent_serial_episode') + ' ' +  media.episode + (media.title ? ' - ' + media.title : ''),
  									quality: media.rip + ' - ' + media.quality + 'p ',
  									translation: media.translation, 
  									info: filter_items.voice[choice.voice], 
  									voice_name: filter_items.voice[choice.voice]
  								});
  							}
  						});
  					}
  				}
  			}
  		} else if (results.player_links.movie && results.player_links.movie.length > 0) {
  			for (var keyt in extract) {
  				var movie = extract[keyt];
					filtred.push({
						title: movie.translation,
						quality: movie.rip + ' - ' + movie.quality + 'p ',
						translation: keyt, 
						voice_name: movie.translation, 
						info: movie.translation
					});
  			}
  		}
  		return component.order[choice.order].id == 'invers' ? filtred.reverse() : filtred;
  	}
	  function toPlayElement(element) {
      var extra = getFile(element, element.quality);
      var play = {
        title: element.title,
        url: extra.file,
        quality: extra.quality,
        timeline: element.timeline,
        callback: element.mark
      };
      return play;
    }

    function append(items) {
      component.reset();
      component.draw(items, {
        similars: wait_similars,
        onEnter: function onEnter(item, html) {
          var extra = getFile(item, item.quality);

          if (extra.file) {
            var playlist = [];
            var first = toPlayElement(item);

            if (item.season) {
              items.forEach(function (elem) {
                playlist.push(toPlayElement(elem));
              });
            } else {
              playlist.push(first);
            }

            if (playlist.length > 1) first.playlist = playlist;
            Lampa.Player.play(first);
            Lampa.Player.playlist(playlist);
            item.mark();
          } else Lampa.Noty.show(Lampa.Lang.translate('online_nolink'));
        },
        onContextMenu: function onContextMenu(item, html, data, call) {
          call(getFile(item, item.quality));
        }
      });
    }
	}
	
	function kinotochka(component, _object) {
		var network = new Lampa.Reguest();
		var extract = {};
		var results = [];
		var object = _object;
		var filter_items = {};
		var wait_similars;
		var choice = {
			season: 0,
			voice: 0, 
			order: 0
		};
		
		this.searchByTitle = function (_object, query) {
			object = _object;
			var title = object.search;
			var relise = object.search_date || (object.movie.number_of_seasons ? object.movie.first_air_date : object.movie.release_date) || '0000';
			var year = parseInt((relise + '').slice(0, 4));
			var url = API + 'tochka/' + encodeURIComponent(title) + '/' + year;
			network.clear();
			network.timeout(10000);
			network.silent(url, function (json) {
				if (json.length) success(json[0]);
				else component.doesNotAnswer(title);
				component.loading(false);
			}, function (a, c) {
				component.doesNotAnswer();
			});
		};
		this.extendChoice = function (saved) {
			Lampa.Arrays.extend(choice, saved, true);
		};
		
		this.reset = function () {
			component.reset();
			choice = {
				season: 0,
				voice: 0, 
				order: 0
			};
			append(filtred());
			component.saveChoice(choice);
		};
		
		this.filter = function (type, a, b) {
			choice[a.stype] = b.index;
			component.reset();
			filter();
			append(filtred());
			component.saveChoice(choice);
		};
		
		this.destroy = function () {
			network.clear();
			results = null;
		};
	
		function success(json) {
			results = json;
			filter();
			append(filtred());
		}
		
		function filter() {
			filter_items = {
				season: [],
				voice: [],
				order: []
			};
			if (object.movie.number_of_seasons) {
				var voices = [];
				var season = [];
				component.order.forEach(function (i){
					filter_items.order.push(i.title);
				});
				results.forEach(function (voice) {
					if (voice.u.indexOf('serial') > -1) {
						var vo = voice.title.split('|');
						var voic = voice.u.indexOf('e00') == -1 && voice.u.indexOf('_[') > -1 ? voice.u.match(/s(\d+)e(\d+?)_/i) : voice.u.indexOf('e00') > -1 ? voice.u.match(/s(\d+)e00-(\d+)_/i) : voice.u.match(/s(\d+)e(\d+?)mp4/i);
						voices.push(vo[1] ? vo[1] : voice.translator);
						console.log(voic)
						season.push(voic[1]);
					}
				});
				voices.filter(function (item, position, array) {
					return array.lastIndexOf(item) === position; // вернём уникальные элементы
				}).forEach(function (voic) {
					filter_items.voice.push(voic);
				});
				season.filter(function (item, position, array) {
					return array.lastIndexOf(item) === position; // вернём уникальные элементы
				}).forEach(function (season) {
					filter_items.season.push(parseInt(season) + ' ' + Lampa.Lang.translate('torrent_serial_season'));
				});
				if (!filter_items.voice[choice.voice]) choice.voice = 0;
				/*	extract[choice.season].folder.forEach(function (f) {
						f.folder.forEach(function (t) {
							if (filter_items.voice.indexOf(t.title) == -1) filter_items.voice.push(t.title);
						});
					});
					if (!filter_items.voice[choice.voice]) choice.voice = 0;
					*/
			}
			component.filter(filter_items, choice);
		}
		
		function filtred() {
			var filtred = [];
			
			if (object.movie.number_of_seasons) {
				results.forEach(function (episode) {
					if (episode.u.indexOf('serial') > -1) {
						var transl = episode.title.split('|');
						if (transl[1] == filter_items.voice[choice.voice]) {
							var qual = episode.quality ? episode.quality.toUpperCase() : '';
							var s_e = episode.u.indexOf('e00') == -1 && episode.u.indexOf('_[') > -1 ? episode.u.match(/s(\d+)e(\d+?)_/i) : episode.u.indexOf('e00') > -1 ? episode.u.match(/s(\d+)e00-(\d+)_/i) : episode.u.match(/s(\d+)e(\d+?)mp4/i);
							// if(parseInt(s_e[1]) == parseInt(filter_items.season[choice.season])) {
							filtred.push({
								title: 'S' + parseInt(s_e[1]) + ' / ' + episode.title,
								season: s_e[1],
								quality: qual,
								translator: transl[1] ? transl[1] : voice.translator,
								file: episode.u,
								info: ''
							});
						}
						//}
					}
				});
			} else {
				filtred.push({
					title: results.voice || object.movie.title,
					quality: results.quality || '',
					voice: results.voice || '',
					file: results.video,
					info: ''
				});
			}
			return component.order[choice.order].id == 'invers' ? filtred.reverse() : filtred;
		}

		function getFile(element, max_quality) {
			var quality = {},
				first = element.file.reverse()[0];
			var preferably = Lampa.Storage.get('video_quality_default', '1080');
			element.file.reverse().forEach(function (file) {
				var q = file.match("\\_(\\d+).mp4");
				if (q) {
					quality[q[1] + 'p'] = file.replace(/\[\d+p\]/, '');
					if (!first || q[1] == preferably) first = quality[q[1] + 'p'];
				}
			});
			return {
				file: first,
				quality: quality
			};
		}
		
		function toPlayElement(element) {
      var extra = getFile(element, element.quality);
      var play = {
        title: element.title,
        url: extra.file,
        quality: extra.quality,
        timeline: element.timeline,
        callback: element.mark
      };
      return play;
    }

    function append(items) {
      component.reset();
      component.draw(items, {
        similars: wait_similars,
        onEnter: function onEnter(item, html) {
          var extra = getFile(item, item.quality);

          if (extra.file) {
            var playlist = [];
            var first = toPlayElement(item);

            if (item.season) {
              items.forEach(function (elem) {
                playlist.push(toPlayElement(elem));
              });
            } else {
              playlist.push(first);
            }

            if (playlist.length > 1) first.playlist = playlist;
            Lampa.Player.play(first);
            Lampa.Player.playlist(playlist);
            item.mark();
          } else Lampa.Noty.show(Lampa.Lang.translate('online_nolink'));
        },
        onContextMenu: function onContextMenu(item, html, data, call) {
          call(getFile(item, item.quality));
        }
      });
    }
	}

	function kinokrad(component, _object) {
		var network = new Lampa.Reguest();
		var extract = {};
		var results = [];
		var object = _object;
		var filter_items = {};
		var wait_similars;
		var choice = {
			season: 0,
			voice: 0, 
			order: 0
		};
		
		this.searchByTitle = function (_object, query) {
			object = _object;
			var title = object.search;
			var relise = object.search_date || (object.movie.number_of_seasons ? object.movie.first_air_date : object.movie.release_date) || '0000';
			var year = parseInt((relise + '').slice(0, 4));
			var url = API + 'Krad/' + encodeURIComponent(title) + '/' + year;
			network.clear();
			network.timeout(10000);
			network.silent(url, function (json) {
				if (json.length) success(json[0]);
				else component.doesNotAnswer(title);
				component.loading(false);
			}, function (a, c) {
				component.doesNotAnswer();
			});
		};
		this.extendChoice = function (saved) {
			Lampa.Arrays.extend(choice, saved, true);
		};
		
		this.reset = function () {
			component.reset();
			choice = {
				season: 0,
				voice: 0, 
				order: 0
			};
			append(filtred());
			component.saveChoice(choice);
		};
		
		this.filter = function (type, a, b) {
			choice[a.stype] = b.index;
			component.reset();
			filter();
			append(filtred());
			component.saveChoice(choice);
		};
		
		this.destroy = function () {
			network.clear();
			results = null;
		};
		
		function success(json) {
			results = json;
			filter();
			append(filtred());
		}
		
		function filter() {
			filter_items = {
				season: [],
				voice: [],
				quality: []
			};
			if (object.movie.number_of_seasons) {
				var voices = [];
				var season = [];
				results.forEach(function (voice) {
					if (voice.u.indexOf('serial') > -1) {
						var vo = voice.title.split('|');
						var voic = voice.u.indexOf('e00') == -1 && voice.u.indexOf('_[') > -1 ? voice.u.match(/s(\d+)e(\d+?)_/i) : voice.u.indexOf('e00') > -1 ? voice.u.match(/s(\d+)e00-(\d+)_/i) : voice.u.match(/s(\d+)e(\d+?)mp4/i);
						voices.push(vo[1] ? vo[1] : voice.translator);
						console.log(voic)
						season.push(voic[1]);
					}
				});
				voices.filter(function (item, position, array) {
					return array.lastIndexOf(item) === position; // вернём уникальные элементы
				}).forEach(function (voic) {
					filter_items.voice.push(voic);
				});
				season.filter(function (item, position, array) {
					return array.lastIndexOf(item) === position; // вернём уникальные элементы
				}).forEach(function (season) {
					filter_items.season.push(parseInt(season) + ' ' + Lampa.Lang.translate('torrent_serial_season'));
				});
				if (!filter_items.voice[choice.voice]) choice.voice = 0;
				/*	extract[choice.season].folder.forEach(function (f) {
						f.folder.forEach(function (t) {
							if (filter_items.voice.indexOf(t.title) == -1) filter_items.voice.push(t.title);
						});
					});
					if (!filter_items.voice[choice.voice]) choice.voice = 0;
					*/
			}
			component.filter(filter_items, choice);
		}
		
		function filtred() {
			var filtred = [];
			
			if (object.movie.number_of_seasons) {
				results.forEach(function (episode) {
					if (episode.u.indexOf('serial') > -1) {
						var transl = episode.title.split('|');
						if (transl[1] == filter_items.voice[choice.voice]) {
							var qual = episode.quality ? episode.quality.toUpperCase() : '';
							var s_e = episode.u.indexOf('e00') == -1 && episode.u.indexOf('_[') > -1 ? episode.u.match(/s(\d+)e(\d+?)_/i) : episode.u.indexOf('e00') > -1 ? episode.u.match(/s(\d+)e00-(\d+)_/i) : episode.u.match(/s(\d+)e(\d+?)mp4/i);
							// if(parseInt(s_e[1]) == parseInt(filter_items.season[choice.season])) {
							filtred.push({
								title: 'S' + parseInt(s_e[1]) + ' / ' + episode.title,
								season: s_e[1],
								quality: qual,
								translator: transl[1] ? transl[1] : voice.translator,
								file: episode.u,
								info: ''
							});
						}
						//}
					}
				});
			} else {
				filtred.push({
					title: results.voice,
					quality: results.quality,
					voice: results.voice || '',
					file: results.video,
					info: ''
				});
			}
			return component.order[choice.order].id == 'invers' ? filtred.reverse() : filtred;
		}

		function getFile(element, max_quality) {
			var quality = {},
				first = '';
			var preferably = Lampa.Storage.get('video_quality_default', '1080');
			element.file.split(',').reverse().forEach(function (file) {
				var q = file.match("\\[(\\d+)p");
				if (q) {
					quality[q[1] + 'p'] = file.replace(/\[\d+p\]/, '');
					if (!first || q[1] == preferably) first = quality[q[1] + 'p'];
				}
			});
			return {
				file: first || element.file,
				quality: quality
			};
		}
		
		function toPlayElement(element) {
      var extra = getFile(element, element.quality);
      var play = {
        title: element.title,
        url: extra.file,
        quality: extra.quality,
        timeline: element.timeline,
        callback: element.mark
      };
      return play;
    }

    function append(items) {
      component.reset();
      component.draw(items, {
        similars: wait_similars,
        onEnter: function onEnter(item, html) {
          var extra = getFile(item, item.quality);

          if (extra.file) {
            var playlist = [];
            var first = toPlayElement(item);

            if (item.season) {
              items.forEach(function (elem) {
                playlist.push(toPlayElement(elem));
              });
            } else {
              playlist.push(first);
            }

            if (playlist.length > 1) first.playlist = playlist;
            Lampa.Player.play(first);
            Lampa.Player.playlist(playlist);
            item.mark();
          } else Lampa.Noty.show(Lampa.Lang.translate('online_nolink'));
        },
        onContextMenu: function onContextMenu(item, html, data, call) {
          call(getFile(item, item.quality));
        }
      });
    }
	}

	function pub(component, _object) {
		var network = new Lampa.Reguest();
		var extract = {};
		var results = [];
		var object = _object;
		var filter_items = {};
		var embed = 'http://api.service-kp.com/v1/items';
		var streamingType;
		var supportHevc;
		var wait_similars;
		var choice = {
			season: 0,
			voice: 0,
			order: 0,
			type: 0, 
			codec: 0
		};
		this.search = function (_object, sim) {
  		if (wait_similars && sim) return this.find(sim[0].id);
  	};
  	this.searchByTitle = function (_object, query) {
			object = _object;
			var _this = this;
			var title = object.search.trim();
			var relise = object.search_date || (object.movie.number_of_seasons ? object.movie.first_air_date : object.movie.release_date) || '0000';
			var year = parseInt((relise + '').slice(0, 4));
			var orig = object.movie.original_title || object.movie.original_name;
			var imdb = object.movie.imdb_id && parseInt(object.movie.imdb_id.slice(2));
			var kpID = object.movie.kinopoisk_id;
			var url = embed + '/search';
			url = Lampa.Utils.addUrlComponent(url, 'q=' + encodeURIComponent(title));
			url = Lampa.Utils.addUrlComponent(url, 'access_token=' + Pub.token);
			network.clear();
			network.timeout(10000);
			network.silent(url, function (json) {
				json = json.items;
				if (json.length == 0) component.doesNotAnswer(title);
				else {
					var cards = json.filter(function (c) {
						return c.imdb == imdb || c.kinopoisk == kpID;
					});
					if (!cards.length) {
  					cards = json.filter(function (c) {
  						return c.year > year - 2 && c.year < year + 2;
  					});
						var tmp = cards.filter(function (c) {
							return c.year == year;
						});
						if (tmp.length) cards = tmp;
						else return component.doesNotAnswer(title);
					}
					if (cards.length) {
						var _tmp = cards.filter(function (c) {
							c.title_ru = c.title.split(' / ')[0];
							return component.equalTitle(c.title_ru.replace(/\s/, ' '), title.replace(/\s/, ' '));
						});
						if (_tmp.length) cards = _tmp;
						var _tmp2 = cards.filter(function (c) {
							c.title_org = c.title.split(' / ')[1];
							if (!c.title_org) return;
							return component.equalTitle(c.title_org.replace(/\s/, ' '), orig.replace(/\s/, ' '));
						});
						if (_tmp2.length) cards = _tmp2;
					}
					if (cards.length == 1) _this.find(cards[0].id);
					else if (json.length > 1) {
					  wait_similars = true;
						component.similars(json);
						component.loading(false);
					} else component.doesNotAnswer(title);
				}
			}, function (a, c) {
				component.doesNotAnswer();
			});
		};
		this.find = function (id) {
			network.clear();
			network.timeout(10000);
			var url = embed + '/' + id;
			url = Lampa.Utils.addUrlComponent(url, 'access_token=' + Pub.token);
			network.silent(url, function (json) {
				if (Lampa.Arrays.getKeys(json.item).length) {
					network.silent(embed.slice(0, -6) + '/device/info?access_token=' + Pub.token, function (param) {
						streamingType = param.device.settings.streamingType.value.find(function (t) {
							return t.selected == 1;
						});
						supportHevc = param.device.settings.supportHevc.value == 1;
						choice.type = streamingType.id - 1;
						success(json.item);
						component.loading(false);
					}, function (a, c) {
						component.doesNotAnswer();
					});
				} else component.doesNotAnswer(object.search);
			}, function (a, c) {
				component.doesNotAnswer();
			});
		};
		this.extendChoice = function (saved) {
			Lampa.Arrays.extend(choice, saved, true);
		};
		this.reset = function () {
			component.reset();
			choice = {
				season: 0,
				voice: 0,
				codec: 0, 
				order: 0, 
				type: 0
			};
			append(filtred());
			component.saveChoice(choice);
		};
		this.filter = function (type, a, b) {
			choice[a.stype] = b.index;
			component.reset();
			filter();
			append(filtred());
			component.saveChoice(choice);
		};
		this.destroy = function () {
			network.clear();
			results = null;
		};
		function success(json) {
			results = json;
			filter();
			append(filtred());
		}
		function filter() {
			filter_items = {
				season: [],
				voice: [],
				type: [], 
				order: [], 
				codec: []
			};
		  ['HTTP', 'HLS', 'HLS2', 'HLS4'].forEach(function (t) {
				filter_items.type.push(t);
			});
		  ['H264', 'H265'].forEach(function (c) {
				filter_items.codec.push(c);
			});
			if (results.seasons) {
			  component.order.forEach(function (i){
					filter_items.order.push(i.title);
				});
				results.seasons.forEach(function (season) {
					filter_items.season.push(parseInt(season.number) + ' ' + Lampa.Lang.translate('torrent_serial_season'));
				});
			}
			component.filter(filter_items, choice);
		}
		function filtred() {
			var filtred = [];
			var type = filter_items.type[choice.type];
			var CODEC = filter_items.codec[choice.codec];
			if (results.seasons) {
				results.seasons.forEach(function (season) {
					if (season.number == parseInt(filter_items.season[choice.season])) {
						season.episodes.forEach(function (ep) {
							filtred.push({
								title: ep.title || '',
								season: ep.snumber,
								episode: ep.number,
								quality: ep.files[0].quality + ' (' + CODEC + ')',
								file: ep.files,
								codec: CODEC,
								voice: parseTrackss(ep.audios).join('<br>'), 
								tracks: parseTracks(ep.audios || ''),
								subtitles: parseSubs(ep.subtitles || ''),
								info: type
							});
						});
					}
				});
			} else {
				results.videos.forEach(function (movie) {
					filtred.push({
						title: object.movie.title,
						quality: movie.files[0].quality + ' (' + CODEC + ')',
						file: movie.files,
						codec: CODEC,
						voice: parseTrackss(movie.audios).join('<br>'), 
						tracks: parseTracks(movie.audios || ''),
						subtitles: parseSubs(movie.subtitles || ''),
						info: type
					});
				});
			}
			return component.order[choice.order].id == 'invers' ? filtred.reverse() : filtred;
		}
		function parseSubs(vod) {
			var subtitles = vod.map(function (item) {
				return {
					label: item.lang.toUpperCase() + (item.forced && ' - [FORCED]' || ''),
					url: item.url
				};
			});
			return subtitles.length ? subtitles : false;
		}
		function parseTracks(vod) {
			var tracks = vod.map(function (track) {
				return {
					language: track.lang.toUpperCase(),
					label: track.codec.toUpperCase() + ((track.channels == 6 ? '5.1' : '') && ' - ' + track.channels || '') + (track.type && ' - ' + track.type.title || '') + (track.author && ' - ' + track.author.title || ''),
				};
			});
			return tracks.length ? tracks : false;
		}
		function parseTrackss(vod) {
			var tracks = vod.map(function (track, i) {
				return (i+1)+ (track.type && '. ' + track.type.title || '') + (track.author && ' - ' + track.author.title || '') + (track.lang && '(' + track.lang+')' || '');
			});
			return tracks.length ? tracks : false;
		}
		function getFile(element) {
			var file = '';
			var quality = {};
			var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
			
			var codec = element.file.filter(function (q) {
				return q.codec == filter_items.codec[choice.codec].toLowerCase();
			});
			if (codec.length == 0) codec = element.file;
			codec.forEach(function (item) {
				quality[item.quality] = item.url[filter_items.type[choice.type].toLowerCase()];
			});
			var max_quality = Lampa.Arrays.getKeys(quality)[0];
			file = quality[max_quality];
			if (quality[preferably]) file = quality[preferably];
			return {
				stream: file,
				quality: quality
			};
		}
	  function toPlayElement(element) {
      var ex = getFile(element);
      var play = {
        url: ex.stream,
        timeline: element.timeline,
        title: element.title,
        subtitles: element.subtitles,
        translate: {
					tracks: element.tracks
				},
        quality: ex.qualitys,
        callback: element.mark
      };
      return play;
    }
    function append(items) {
      component.reset();
      component.draw(items, {
        similars: wait_similars,
        onEnter: function onEnter(item, html) {
          var ex = getFile(item);

          if (ex.stream) {
            var playlist = [];
            var first = toPlayElement(item);

            if (item.season) {
              items.forEach(function (elem) {
                playlist.push(toPlayElement(elem));
              });
            } else {
              playlist.push(first);
            }

            if (playlist.length > 1) first.playlist = playlist;
            Lampa.Player.play(first);
            Lampa.Player.playlist(playlist);
            item.mark();
          } else Lampa.Noty.show(Lampa.Lang.translate('online_nolink'));
        },
        onContextMenu: function onContextMenu(item, html, data, call) {
          call(getFile(item));
        }
      });
    }
	}
	function component(object) {
    var network = new Lampa.Reguest();
    var scroll = new Lampa.Scroll({
      mask: true,
      over: true
    });
    var files = new Lampa.Explorer(object);
    var filter = new Lampa.Filter(object);
    var sources = {
      videocdn: videocdn,
      rezka: rezka,
      kinobase: kinobase,
      collaps: collaps,
      filmix: filmix, 
      kinokrad: kinokrad, 
      kinotochka: kinotochka, 
      pub: pub, 
    };
    var last;
    var extended;
    var selected_id;
    var source;
    var balanser;
    var initialized;
    var balanser_timer;
    var images = [];
		var balansers = Modss.balansers();
    if (object.movie.number_of_seasons) {
		  delete balansers.kinotochka
		  delete balansers.kinokrad
		} 

    var filter_sources = Lampa.Arrays.getKeys(balansers);
    var filter_translate = {
      season: Lampa.Lang.translate('torrent_serial_season'),
      voice: Lampa.Lang.translate('torrent_parser_voice'),
      source: Lampa.Lang.translate('settings_rest_source')
    };

    this.initialize = function () {
      var _this = this;

      source = this.createSource();

      filter.onSearch = function (value) {
        Lampa.Activity.replace({
          search: value,
          clarification: true
        });
      };

      filter.onBack = function () {
        _this.start();
      };
      
      filter.render().find('.selector').on('hover:enter', function () {
        clearInterval(balanser_timer);
      })

      filter.onSelect = function (type, a, b) {
        if (type == 'filter') {
          if (a.reset) {
            if (extended) source.reset();else _this.start();
          } else {
            source.filter(type, a, b);
          }
        } else if (type == 'sort') {
          Lampa.Select.close();

          _this.changeBalanser(a.source);
        }
        if (object.movie.number_of_seasons || balanser == 'pub') filter.render().find('.filter--filter').show();
			  else filter.render().find('.filter--filter').hide();
      };

      if (object.movie.number_of_seasons || balanser == 'pub') filter.render().find('.filter--filter').show();
		  else filter.render().find('.filter--filter').hide();
		  filter.render().find('.filter--sort').on('hover:enter', function () {
				$('body').find('.selectbox__title').text(Lampa.Lang.translate('online_balanser'));
			});
			if (filter.addButtonBack) filter.addButtonBack();
      filter.render().find('.filter--sort span').text(Lampa.Lang.translate('online_balanser'));
      files.appendFiles(scroll.render());
      files.appendHead(filter.render());
      scroll.body().addClass('torrent-list');
      scroll.minus(files.render().find('.explorer__files-head'));
      this.search();
    };

    this.changeBalanser = function (balanser_name) {
      var last_select_balanser = Lampa.Storage.cache('online_last_balanser', 3000, {});
      last_select_balanser[object.movie.id] = balanser_name;
      Lampa.Storage.set('online_last_balanser', last_select_balanser);
      var to  = this.getChoice(balanser_name);
      var from = this.getChoice();
      if(from.voice_name) to.voice_name = from.voice_name;
      this.saveChoice(to, balanser_name);
      Lampa.Activity.replace();
    };

    this.createSource = function () {
      var priority_balanser = Lampa.Storage.field('priority_balanser');
      var last_select_balanser = Lampa.Storage.cache('online_last_balanser', 3000, {});
      if (last_select_balanser[object.movie.id]) {
        balanser = last_select_balanser[object.movie.id];
        Lampa.Storage.set('online_last_balanser', last_select_balanser);
      } else {
        balanser = priority_balanser;
      }
      if (!sources[balanser]) {
        balanser = priority_balanser;
      }
      return new sources[balanser](this, object);
    };

    this.proxy = function (name) {
			var proxy = '';
			var need = Lampa.Storage.field('mods_proxy_' + name);
			var need_url = Lampa.Storage.get('onl_mods_proxy_' + name);
			var prox = Lampa.Storage.get('mods_proxy_all');
			var main = Lampa.Storage.get('mods_proxy_main');
			var myprox = 'http://prox.lampa.stream/';
			var pr = 'https://cors.eu.org/';
			var reserv = 'http://lampa.stream/prox/';
			if (Lampa.Storage.field('mods_proxy_main') === true || (need == 'on' && need_url.length == 0 && prox == '')) proxy = myprox;
			if ((need == 'on' || main) && name == 'videocdn' && (need_url.length == 0 || need_url.indexOf('cors.eu.org') > -1)) return '';
			if ((need == 'on' || main) && name == 'kinobase' && (need_url.length == 0 || need_url.indexOf('cors.eu.org') > -1)) return myprox;
			if ((need == 'on' || main) && name == 'cdnmovies' && need_url.length == 0) return reserv;
			if ((need == 'on' || main) && name == 'hdrezka' && need_url.length == 0) return myprox;
			else if (need == 'on' && need_url.length >= 0 && prox !== '') proxy = prox;
			else if (need == 'url' || (need == 'on' && need_url.length > 0)) proxy = need_url;
			else if (prox && need == 'on') proxy = prox;
			//else if (main && need == 'on') proxy = myprox;
			if (proxy && proxy.slice(-1) !== '/') {
				proxy += '/';
			}
			return proxy;
		};
    /**
     * Подготовка
     */
    this.create = function () {
      return this.render();
    };
    /**
     * Начать поиск
     */
    this.search = function () {
      this.activity.loader(true);
      this.filter({
        source: filter_sources
      }, this.getChoice());
      this.find();
    };
    this.find = function () {
			var _this2 = this;
			var imdb_id;
			var query = (object.search || object.movie.title).trim();
			var search_date = object.search_date || object.movie.release_date || object.movie.first_air_date || object.movie.last_air_date || '0000';
			var search_year = parseInt((search_date + '').slice(0, 4));
			var orig = object.movie.original_title || object.movie.original_name;
			
			var display = function display(items) {
        if (items && items.length) {
          var is_sure = false;
          if (object.movie.imdb_id) {
            var tmp = items.filter(function (elem) {
              return (elem.imdb_id || elem.imdbId) == object.movie.imdb_id;
            });

            if (tmp.length) {
              items = tmp;
              is_sure = true;
            }
          }
          var cards = items.filter(function (c) {
            var year = c.start_date || c.year || '0000';
            c.tmp_year = parseInt((year + '').slice(0, 4));
            return !c.tmp_year || !search_year || c.tmp_year > search_year - 2 && c.tmp_year < search_year + 2;
          });

          if (orig) {
            var _tmp = cards.filter(function (elem) {
              return _this2.equalTitle(elem.orig_title || elem.nameOriginal || elem.en_title || elem.nameEn || elem.ru_title || elem.nameRu, orig);
            });

            if (_tmp.length) {
              cards = _tmp;
              is_sure = true;
            }
          }

          if (query) {
            var _tmp2 = cards.filter(function (elem) {
              return _this2.equalTitle(elem.title || elem.ru_title || elem.nameRu || elem.en_title || elem.nameEn || elem.orig_title || elem.nameOriginal, query);
            });

            if (_tmp2.length) {
              cards = _tmp2;
              is_sure = true;
            }
          }

          if (cards.length > 1 && search_year) {
            var _tmp3 = cards.filter(function (c) {
              return c.tmp_year == search_year;
            });
            if (_tmp3.length) cards = _tmp3;
          }

          if (cards.length == 1 && is_sure) {
            _this2.extendChoice();
            var kinopoisk_id = cards[0].kp_id || cards[0].kinopoiskId || cards[0].filmId;

            if (kinopoisk_id && source.searchByKinopoisk) {
              source.searchByKinopoisk(object, kinopoisk_id);
            } else if (cards[0].imdb_id && source.searchByImdbID) {
              source.searchByImdbID(object, cards[0].imdb_id);
            } else if (source.search) {
              source.search(object, cards);
            } else {
              _this2.doesNotAnswer();
            }
          } else {
            _this2.similars(items);
            _this2.loading(false);
          }
        } else _this2.doesNotAnswer(query);
      };
	
			var vcdn_search = function vcdn_search() {
				var url;
        if (balanser == 'videoapi') {
          url = 'http://5100.svetacdn.in/api/short';
          url = Lampa.Utils.addUrlComponent(url, 'api_token=qR0taraBKvEZULgjoIRj69AJ7O6Pgl9O');
        } else {
          var prox = _this2.proxy('videocdn');
          url = prox ? prox + 'http://videocdn.tv/api/movies' : 'http://cdn.svetacdn.in/api/movies';
          url = Lampa.Utils.addUrlComponent(url, 'api_token=3i40G5TSECmLF77oAqnEgbx61ZWaOYaE');
        }
				var url_by_title = Lampa.Utils.addUrlComponent(url, 'title=' + encodeURIComponent(query));
				if (object.movie.imdb_id) url = Lampa.Utils.addUrlComponent(url, 'imdb_id=' + encodeURIComponent(object.movie.imdb_id));
				else url = url_by_title;
				network.timeout(1000 * 15);
				network.silent(url, function (json) {
					if (json.data && json.data.length) display(json.data);
					else if (object.movie.imdb_id) {
						network.timeout(1000 * 15);
						network.silent(url_by_title, function (json) {
							if (json.data && json.data.length) display(json.data);
							else display([]);
						}, function (a, c) {
              _this2.doesNotAnswer();
            });
					} else display([]);
				}, function (a, c) {
          _this2.doesNotAnswer();
        });
			};
			
			var kp_search = function kp_search(title) {
  			var url = API;
  			var url_by_title = url + 'KP/' + encodeURIComponent(object.movie.id);
  			if (title) url = url + 'KPfind/' + encodeURIComponent(query);
  			else if (imdb_id) url = url + 'KPimdb/' + encodeURIComponent(imdb_id);
  			else url = url_by_title;
  			network.timeout(1000 * 15);
  			network.silent(url, function (json) {
  			  if (json.items && json.items.length) display(json.items);
  			  else if (json.films && json.films.length) display(json.films);
  			  else {
  					network.timeout(1000 * 15);
  					network.silent(url_by_title, function (json) {
  						if(json.kp) {
  						  _this2.extendChoice();
                source.searchByKinopoisk(object, json.kp);
  						} else vcdn_search();
  					}, function (a, c) {
  						vcdn_search();
  					});
  				}
  			}, function (a, c) {
  				vcdn_search();
  			});
  		};
  		
  	  var letgo = function letgo(imdb_id) {
				if (['videocdn', 'videoapi'].indexOf(balanser) >= 0) vcdn_search();
				else if(source.searchByKinopoisk) kp_search();
				else if (imdb_id && source.searchByImdbID) {
          _this2.extendChoice();
          source.searchByImdbID(object, imdb_id);
        } else {
          var url = _this2.proxy('videocdn') + 'http://cdn.svetacdn.in/api/short';
          url = Lampa.Utils.addUrlComponent(url, 'api_token=3i40G5TSECmLF77oAqnEgbx61ZWaOYaE');
          var url_end = Lampa.Utils.addUrlComponent(url, imdb_id ? 'imdb_id=' + encodeURIComponent(imdb_id) : 'title=' + encodeURIComponent(query));
          network.timeout(1000 * 15);
          network["native"](url_end, function (json) {
            if (json.data && json.data.length) display(json);else {
              network["native"](Lampa.Utils.addUrlComponent(url, 'title=' + encodeURIComponent(query)), display.bind(_this2), kp_search(true));
            }
          }, kp_search(true));
        }
			};
		
		  if (source.searchByTitle) {
        this.extendChoice();
        source.searchByTitle(object, object.movie.title || object.movie.name);
      } else if (object.movie.kinopoisk_id && source.searchByKinopoisk) {
        this.extendChoice();
        source.searchByKinopoisk(object, object.movie.kinopoisk_id);
		  } else if (object.movie.imdb_id) {
        letgo(object.movie.imdb_id);
      } else if (!object.movie.imdb_id && (object.movie.source == 'tmdb' || object.movie.source == 'cub')) {
        var tmdburl = (object.movie.name ? 'tv' : 'movie') + '/' + object.movie.id + '/external_ids?api_key=4ef0d7355d9ffb5151e987764708ce96&language=ru';
        var baseurl = Lampa.TMDB.api(tmdburl);
        network.timeout(1000 * 10);
        network["native"](baseurl, function (ttid) {
			    object.movie.imdb_id = ttid.imdb_id;
          letgo(ttid.imdb_id);
        }, function (a, c) {
          letgo();
        });
      } else letgo();
		};
    this.cleanTitle = function (str) {
			return str.replace(/[ .,:;!?]+/g, ' ').trim();
		};
		this.equalTitle = function (t1, t2) {
      return typeof t1 === 'string' && typeof t2 === 'string' && t1.toLowerCase() === t2.toLowerCase();
		};
		this.parsePlaylist = function (str) {
			var pl = [];
			try {
				if (str.charAt(0) === '[') {
					str.substring(1).split(',[').forEach(function (item) {
						var label_end = item.indexOf(']');
						if (label_end >= 0) {
							var label = item.substring(0, label_end);
							if (item.charAt(label_end + 1) === '{') {
								item.substring(label_end + 2).split(';{').forEach(function (voice_item) {
									var voice_end = voice_item.indexOf('}');
									if (voice_end >= 0) {
										var voice = voice_item.substring(0, voice_end);
										pl.push({
											label: label,
											voice: voice,
											links: voice_item.substring(voice_end + 1).split(' or ')
										});
									}
								});
							} else {
								pl.push({
									label: label,
									links: item.substring(label_end + 1).split(' or ')
								});
							}
						}
						return null;
					});
				}
			} catch (e) {}
			return pl;
		};
    this.getChoice = function (for_balanser) {
      var data = Lampa.Storage.cache('online_choice_' + (for_balanser || balanser), 3000, {});
      var save = data[selected_id || object.movie.id] || {};
      Lampa.Arrays.extend(save, {
        season: 0,
        voice: 0,
        voice_name: '',
        voice_id: 0,
        episodes_view: {},
        movie_view: ''
      });
      return save;
    };
    this.extendChoice = function () {
      extended = true;
      source.extendChoice(this.getChoice());
    };
    this.saveChoice = function (choice, for_balanser) {
      var data = Lampa.Storage.cache('online_choice_' + (for_balanser || balanser), 3000, {});
      data[selected_id || object.movie.id] = choice;
      Lampa.Storage.set('online_choice_' + (for_balanser || balanser), data);
      var last_select_balanser = Lampa.Storage.cache('online_last_balanser', 3000, {});
      last_select_balanser[object.movie.id] = (for_balanser || balanser);
      Lampa.Storage.set('online_last_balanser', last_select_balanser);
    };
    /**
     * Есть похожие карточки
     * @param {Object} json 
     */
    this.similars = function (json) {
      var _this3 = this;
      json.forEach(function (elem) {
        var info = [];
        var year = ((elem.start_date || elem.year || '') + '').slice(0, 4);
      	var transl = elem.translations ? String(elem.translations).split(',').slice(0, 2) : '';
				var count_s = elem.seasons_count ? elem.seasons_count + ' ' + Lampa.Lang.translate('torrent_serial_season').toLowerCase() + _this3.num_word(elem.seasons_count, ['', 'а', 'ов']) : '';
				var count_eps = elem.episodes_count ? elem.episodes_count + ' эпизод' + _this3.num_word(elem.episodes_count, ['', 'а', 'ов']) : '';
        if (year) info.push(year);
				if (elem.type) info.push(elem.type == 'serial' || elem.type == 'MINI_SERIES' ? ('Cериал' + (count_s && ' - ' + count_s + ' из них ' + count_eps)) : 
				           elem.type == 'TV_SHOW' ? ' / Тв-Шоу' : 
				           elem.type == ('movie' || 'film' || 'FILM') ? ' / Фильм' : elem.type);
				if (transl) info.push(transl);
        if (elem.rating && elem.rating !== 'null' && elem.filmId) info.push(Lampa.Template.get('online_prestige_rate', {
          rate: elem.rating
        }, true));
        if (elem.quality && elem.quality.length) info.push(elem.quality);

        if (elem.countries && elem.countries.length) {
          info.push((elem.filmId ? elem.countries.map(function (c) {
            return c.country;
          }) : elem.countries).join(', '));
        }

        if (elem.categories && elem.categories.length) {
        //  info.push(elem.categories.slice(0, 4).join(', '));
        }

        var name = elem.title || elem.ru_title || elem.en_title || elem.nameRu || elem.nameEn;
        var orig = elem.orig_title || elem.nameEn || '';
        elem.title = name + (orig && orig !== name ? ' / ' + orig : '');
        elem.time = elem.filmLength || '';
        elem.info = info.join('<span class="online-prestige-split">●</span>');
        var item = Lampa.Template.get('online_prestige_folder', elem);
        item.on('hover:enter', function () {
          _this3.activity.loader(true);

          _this3.reset();

          object.search_date = year;
          selected_id = elem.id;

          _this3.extendChoice();

          var kinopoisk_id = elem.kp_id || elem.filmId;

          if (kinopoisk_id && source.searchByKinopoisk) {
            source.searchByKinopoisk(object, kinopoisk_id);
          } else if (source.search) {
            source.search(object, [elem]);
          } else {
            _this3.doesNotAnswer();
          }
        }).on('hover:focus', function (e) {
          last = e.target;
          scroll.update($(e.target), true);
        });
        scroll.append(item);
      });
    };
    this.clearImages = function () {
      images.forEach(function (img) {
        img.onerror = function () {};

        img.onload = function () {};

        img.src = '';
      });
      images = [];
    };
    /**
     * Очистить список файлов
     */
    this.reset = function () {
      last = false;
      clearInterval(balanser_timer);
      network.clear();
      this.clearImages();
      scroll.render().find('.empty').remove();
      scroll.clear();
    };
    /**
     * Загрузка
     */
    this.loading = function (status) {
      if (status) this.activity.loader(true);else {
        this.activity.loader(false);
        this.activity.toggle();
      }
    };
    /**
     * Построить фильтр
     */
    this.filter = function (filter_items, choice) {
      var _this4 = this;
      var select = [];

      var add = function add(type, title) {
        var need = _this4.getChoice();
        var items = filter_items[type];
        var subitems = [];
        var value = need[type];
        items.forEach(function (name, i) {
          subitems.push({
            title: name,
            selected: value == i,
            index: i
          });
        });
        select.push({
          title: title,
          subtitle: items[value],
          items: subitems,
          stype: type
        });
      };

      filter_items.source = filter_sources;
      choice.source = filter_sources.indexOf(balanser);
      select.push({
        title: Lampa.Lang.translate('torrent_parser_reset'),
        reset: true
      });
      this.saveChoice(choice);
      if (filter_items.voice && filter_items.voice.length) add('voice', Lampa.Lang.translate('torrent_parser_voice'));
      if (filter_items.season && filter_items.season.length) add('season', Lampa.Lang.translate('torrent_serial_season'));
      if (filter_items.type && filter_items.type.length) add('type', Lampa.Lang.translate('filter_video_stream') + '');
			if (filter_items.codec && filter_items.codec.length) add('codec', Lampa.Lang.translate('filter_video_codec') + '');
			if (filter_items.order && filter_items.order.length) add('order', Lampa.Lang.translate('filter_series_order') + '');
			
			filter.set('filter', select);
      filter.set('sort', filter_sources.map(function (e) {
        return {
				  title: balansers[e],
          source: e,
          selected: e == balanser
        };
      }));
      this.selected(filter_items);
    };
    /**
     * Закрыть фильтр
     */
    this.closeFilter = function () {
      if ($('body').hasClass('selectbox--open')) Lampa.Select.close();
    };
    /**
     * Показать что выбрано в фильтре
     */
    this.selected = function (filter_items) {
      var need = this.getChoice(), 
          select = [];

      for (var i in need) {
        if (filter_items[i] && filter_items[i].length) {
          if (i == 'voice') {
            select.push(filter_translate[i] + ': ' + filter_items[i][need[i]]);
          } else if (i !== 'source') {
            if (filter_items.season.length >= 1) {
              select.push(filter_translate.season + ': ' + filter_items[i][need[i]]);
            }
          }
        }
      }

      filter.chosen('filter', select);
      filter.chosen('sort', [balanser]);
      this.new_seria();
    };
    this.getEpisodes = function (season, call) {
      var episodes = [];
      if (typeof object.movie.id == 'number' && object.movie.name) {
        var tmdburl = 'tv/' + object.movie.id + '/season/' + season + '?api_key=4ef0d7355d9ffb5151e987764708ce96&language=' + Lampa.Storage.get('language', 'ru');
        var baseurl = Lampa.TMDB.api(tmdburl);
        network.timeout(1000 * 10);
        network["native"](baseurl, function (data) {
          episodes = data.episodes || [];
          call(episodes);
        }, function (a, c) {
          call(episodes);
        });
      } else call(episodes);
    };
    /**
     * Добавить элементы в список
     */
    this.append = function (item) {
      item.on('hover:focus', function (e) {
        last = e.target;
        scroll.update($(e.target), true);
      });
      scroll.append(item);
    };
    /**
     * Отрисовка файлов
     */
    this.draw = function (items) {
      var _this4 = this;

      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!items.length) return this.empty();
      this.getEpisodes(items[0].season, function (episodes) {
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var serial = object.movie.name ? true : false;

        var choice = _this4.getChoice();
        
        var fully = window.innerWidth > 480;
        var scroll_to_element = false;
        var scroll_to_mark = false;
        items.forEach(function (element, index) {
          var episode = serial && episodes.length && !params.similars ? episodes.find(function (e) {
            return e.episode_number == element.episode;
          }) : false;
          var episode_num = element.episode || index + 1;
          var episode_last = choice.episodes_view[element.season];
          Lampa.Arrays.extend(element, {
            info: '',
            quality: '',
            time: Lampa.Utils.secondsToTime((episode ? episode.runtime : object.movie.runtime) * 60, true)
          });
          var hash_timeline = Lampa.Utils.hash(element.season ? [element.season, element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var hash_behold = Lampa.Utils.hash(element.season ? [element.season, element.episode, object.movie.original_title, element.voice_name].join('') : object.movie.original_title + element.voice_name);
          var data = {
            hash_timeline: hash_timeline,
            hash_behold: hash_behold
          };
          var info = [];

          if (element.season) {
            element.translate_episode_end = _this4.getLastEpisode(items);
            element.translate_voice = element.voice_name;
          }

          element.timeline = Lampa.Timeline.view(hash_timeline);

          if (episode) {
            element.title = (element.episode_name || episode.name);
            if (element.info.length < 30 && episode.vote_average) info.push(Lampa.Template.get('online_prestige_rate', {
              rate: parseFloat(episode.vote_average + '').toFixed(1)
            }, true));
            if (episode.air_date && fully) info.push(Lampa.Utils.parseTime(episode.air_date).full);
          } else if (object.movie.release_date && fully) {
            info.push(Lampa.Utils.parseTime(object.movie.release_date).full);
          }

          if (!serial && object.movie.tagline && element.info.length < 30) info.push(object.movie.tagline);
          if (element.info) info.push(element.info);
          if (info.length) element.info = info.map(function (i) {
            return '<span>' + i + '</span>';
          }).join('<span class="online-prestige-split">●</span>');
          var html = Lampa.Template.get('online_prestige_full', element);
          var loader = html.find('.online-prestige__loader');
          var image = html.find('.online-prestige__img');

          if (!serial) {
            if (choice.movie_view == hash_behold) scroll_to_element = html;
          } else if (typeof episode_last !== 'undefined' && episode_last == episode_num) {
            scroll_to_element = html;
    		    var cont = _this4.getChoice();
            if(Lampa.Storage.field('online_continued') && cont && cont.continued) { 
        			cont.continued = false;
        			_this4.saveChoice(cont);
        			_this4.extendChoice();
              setTimeout(function(){
        			  $(html).trigger('hover:enter');
        		  }, balanser == 'videocdn' ? 2000 : 50);
      			}
          }
          
          if (serial && episode) image.append('<div class="online-prestige__episode-number-season">S' + episode.season_number + ':E' + episode.episode_number + '</div>');
          if (serial && !episode) {
            image.append('<div class="online-prestige__episode-number">' + ('0' + (element.episode || index + 1)).slice(-2) + '</div>');
            loader.remove();
          } else {
            var img = html.find('img')[0];

            img.onerror = function () {
              img.src = './img/img_broken.svg';
            };

            img.onload = function () {
              image.addClass('online-prestige__img--loaded');
              loader.remove();
            };

            img.src = Lampa.TMDB.image('t/p/w300' + (episode ? episode.still_path : object.movie.backdrop_path));
            images.push(img);
          }

          html.find('.online-prestige__timeline').append(Lampa.Timeline.render(element.timeline));

          if (viewed.indexOf(hash_behold) !== -1) {
            scroll_to_mark = html;
            html.find('.online-prestige__img').append('<div class="online-prestige__viewed">' + Lampa.Template.get('icon_viewed', {}, true) + '</div>');
          }

          element.mark = function () {
            viewed = Lampa.Storage.cache('online_view', 5000, []);

            if (viewed.indexOf(hash_behold) == -1) {
              viewed.push(hash_behold);
              Lampa.Storage.set('online_view', viewed);

              if (html.find('.online-prestige__viewed').length == 0) {
                html.find('.online-prestige__img').append('<div class="online-prestige__viewed">' + Lampa.Template.get('icon_viewed', {}, true) + '</div>');
              }
            }

            choice = _this4.getChoice();

            if (!serial) {
              choice.movie_view = hash_behold;
            } else {
              choice.episodes_view[element.season] = episode_num;
            }

            _this4.saveChoice(choice);
            _this4.new_seria();
          };

          element.unmark = function () {
            viewed = Lampa.Storage.cache('online_view', 5000, []);

            if (viewed.indexOf(hash_behold) !== -1) {
              Lampa.Arrays.remove(viewed, hash_behold);
              Lampa.Storage.set('online_view', viewed);
              Lampa.Account.removeStorage('online_view', hash_behold);
              html.find('.online-prestige__viewed').remove();
              _this4.new_seria();
            }
          };

          element.timeclear = function () {
            element.timeline.percent = 0;
            element.timeline.time = 0;
            element.timeline.duration = 0;
            Lampa.Timeline.update(element.timeline);
            _this4.new_seria();
          };

          html.on('hover:enter', function () {
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            if (params.onEnter) params.onEnter(element, html, data);
          }).on('hover:focus', function (e) {
            last = e.target;
            if(['pub', 'collaps'].indexOf(balanser) >= 0){
              $('.voices').remove();
              $('.explorer-card__descr').hide().after('<div class="voices"></div>');
              //$('.explorer-card__descr').html(Lampa.Lang.translate('<b>#{torrent_parser_voice}:</b><br>' +element.voice));
              $('.voices').html(Lampa.Lang.translate('<b>#{torrent_parser_voice}:</b><br>' +element.voice));
            } 
            
            if (params.onFocus) params.onFocus(element, html, data);
            scroll.update($(e.target), true);
          });
          if (params.onRender) params.onRender(element, html, data);

          _this4.contextMenu({
            html: html,
            element: element,
            onFile: function onFile(call) {
              if (params.onContextMenu) params.onContextMenu(element, html, data, call);
            },
            onClearAllMark: function onClearAllMark() {
              items.forEach(function (elem) {
                elem.unmark();
              });
            },
            onClearAllTime: function onClearAllTime() {
              items.forEach(function (elem) {
                elem.timeclear();
              });
            }
          });

          scroll.append(html);
        });

        if (scroll_to_element) {
          last = scroll_to_element[0];
        } else if (scroll_to_mark) {
          last = scroll_to_mark[0];
        }

        Lampa.Controller.enable('content');
      });
    };
    /**
     * Меню
     */
    this.contextMenu = function (params) {
      params.html.on('hover:long', function () {
        function show(extra) {
          var enabled = Lampa.Controller.enabled().name;
          var menu = [];

          if (Lampa.Platform.is('webos')) {
            menu.push({
              title: Lampa.Lang.translate('player_lauch') + ' - Webos',
              player: 'webos'
            });
          }

          if (Lampa.Platform.is('android')) {
            menu.push({
              title: Lampa.Lang.translate('player_lauch') + ' - Android',
              player: 'android'
            });
          }

          menu.push({
            title: Lampa.Lang.translate('player_lauch') + ' - Lampa',
            player: 'lampa'
          });
          menu.push({
            title: Lampa.Lang.translate('online_video'),
            separator: true
          });
          menu.push({
            title: Lampa.Lang.translate('torrent_parser_label_title'),
            mark: true
          });
          menu.push({
            title: Lampa.Lang.translate('torrent_parser_label_cancel_title'),
            unmark: true
          });
          menu.push({
            title: Lampa.Lang.translate('time_reset'),
            timeclear: true
          });

          if (extra) {
            menu.push({
              title: Lampa.Lang.translate('copy_link'),
              copylink: true
            });
          }

          menu.push({
            title: Lampa.Lang.translate('more'),
            separator: true
          });

          if (Lampa.Account.logged() && params.element && typeof params.element.season !== 'undefined' && params.element.translate_voice) {
            menu.push({
              title: Lampa.Lang.translate('online_voice_subscribe'),
              subscribe: true
            });
          }

          menu.push({
            title: Lampa.Lang.translate('online_clear_all_marks'),
            clearallmark: true
          });
          menu.push({
            title: Lampa.Lang.translate('online_clear_all_timecodes'),
            timeclearall: true
          });
          Lampa.Select.show({
            title: Lampa.Lang.translate('title_action'),
            items: menu,
            onBack: function onBack() {
              Lampa.Controller.toggle(enabled);
            },
            onSelect: function onSelect(a) {
              if (a.mark) params.element.mark();
              if (a.unmark) params.element.unmark();
              if (a.timeclear) params.element.timeclear();
              if (a.clearallmark) params.onClearAllMark();
              if (a.timeclearall) params.onClearAllTime();
              Lampa.Controller.toggle(enabled);

              if (a.player) {
                Lampa.Player.runas(a.player);
                params.html.trigger('hover:enter');
              }

              if (a.copylink) {
                if (extra.quality) {
                  var qual = [];

                  for (var i in extra.quality) {
                    qual.push({
                      title: i,
                      file: extra.quality[i]
                    });
                  }

                  Lampa.Select.show({
                    title: Lampa.Lang.translate('settings_server_links'),
                    items: qual,
                    onBack: function onBack() {
                      Lampa.Controller.toggle(enabled);
                    },
                    onSelect: function onSelect(b) {
                      Lampa.Utils.copyTextToClipboard(b.file, function () {
                        Lampa.Noty.show(Lampa.Lang.translate('copy_secuses'));
                      }, function () {
                        Lampa.Noty.show(Lampa.Lang.translate('copy_error'));
                      });
                    }
                  });
                } else {
                  Lampa.Utils.copyTextToClipboard(extra.file, function () {
                    Lampa.Noty.show(Lampa.Lang.translate('copy_secuses'));
                  }, function () {
                    Lampa.Noty.show(Lampa.Lang.translate('copy_error'));
                  });
                }
              }

              if (a.subscribe) {
                Lampa.Account.subscribeToTranslation({
                  card: object.movie,
                  season: params.element.season,
                  episode: params.element.translate_episode_end,
                  voice: params.element.translate_voice
                }, function () {
                  Lampa.Noty.show(Lampa.Lang.translate('online_voice_success'));
                }, function () {
                  Lampa.Noty.show(Lampa.Lang.translate('online_voice_error'));
                });
              }
            }
          });
        }

        params.onFile(show);
      }).on('hover:focus', function () {
        if (Lampa.Helper) Lampa.Helper.show('online_file', Lampa.Lang.translate('helper_online_file'), params.html);
      });
    };
    /**
     * Показать пустой результат
     */
    this.empty = function (msg) {
      var empty = Lampa.Template.get('list_empty');
      if (msg) empty.find('.empty__descr').text(msg);
      scroll.append(empty);
      this.loading(false);
    };
    this.doesNotAnswer = function (query) {
      var _this6 = this;
      this.reset();
      var html = Lampa.Template.get('onlines_does_not_answer', {
        title: (query && query.length) ? (Lampa.Lang.translate('online_query_start') + ' (' + query + ') ' + Lampa.Lang.translate('online_query_end') + Lampa.Lang.translate('online_balanser_dont_work_from')) : Lampa.Lang.translate('online_balanser_dont_work'), 
        balanser: balansers[balanser]
      });
      var tic = 10;
      html.find('.cancel').on('hover:enter', function () {
        clearInterval(balanser_timer);
      });
      html.find('.change').on('hover:enter', function () {
        clearInterval(balanser_timer);
        filter.render().find('.filter--sort').trigger('hover:enter');
      });
      scroll.append(html);
      this.loading(false);
      balanser_timer = setInterval(function () {
        tic--;
        html.find('.timeout').text(tic);

        if (tic == 0) {
          clearInterval(balanser_timer);
          var keys = Lampa.Arrays.getKeys(sources);
          var indx = keys.indexOf(balanser);
          var next = keys[indx + 1];
          if (!next) next = keys[0];
          balanser = next;
          if (Lampa.Activity.active().activity == _this6.activity) _this6.changeBalanser(balanser);
        }
      }, 1000);
    };
    /**
     * Показать пустой результат по ключевому слову
     */
    this.emptyForQuery = function (query) {
      this.empty(Lampa.Lang.translate('online_query_start') + ' (' + query + ') ' + Lampa.Lang.translate('online_query_end'));
    };
    this.getLastEpisode = function (items) {
      var last_episode = 0;
      items.forEach(function (e) {
        if (typeof e.episode !== 'undefined') last_episode = Math.max(last_episode, parseInt(e.episode));
      });
      return last_episode;
    };
    this.new_seria = function () {
			if (object.movie.number_of_seasons) {
				setTimeout(function () {
					$('.card--new_ser, .card--viewed, .full-start__right .time-line, .card--last_view').remove();
					if ($('body').find('.online').length !== 0) {
						if ($('body').find('.online:last-child .torrent-item__viewed').length == 1 || $('body').find('.online:last-child .time-line.hide').length == 0) $('body').find('.full-start__poster').append("<div class='card--viewed' style='right: -0.6em;position: absolute;background: #168FDF;color: #fff;top: 0.8em;padding: 0.4em 0.4em;font-size: 1.2em;-webkit-border-radius: 0.3em;-moz-border-radius: 0.3em;border-radius: 0.3em;'>" + Lampa.Lang.translate('online_viewed') + "</div>");
						else $('body').find('.full-start__poster').append("<div class='card--new_ser' style='right: -0.6em;position: absolute;background: #168FDF;color: #fff;top: 0.8em;padding: 0.4em 0.4em;font-size: 1.2em;-webkit-border-radius: 0.3em;-moz-border-radius: 0.3em;border-radius: 0.3em;'>" + Lampa.Lang.translate('season_new') + " " + Lampa.Lang.translate('torrent_serial_episode') + "</div>");
					}
					Modss.last_view(object.movie);
				}, 50);
			}
		};
    this.num_word = function (value, words) {
			value = Math.abs(value) % 100;
			var num = value % 10;
			if (value > 10 && value < 20) return words[2];
			if (num > 1 && num < 5) return words[1];
			if (num == 1) return words[0];
			return words[2];
		};
    this.order = [{title: 'Стандартно', id: 'normal'}, {title: 'Инвертировать', id: 'invers'}];
    /**
     * Начать навигацию по файлам
     */
    this.start = function () {
      if (Lampa.Activity.active().activity !== this.activity) return;

      if (!initialized) {
        initialized = true;
        this.initialize();
      }

      Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
      Lampa.Controller.add('content', {
        toggle: function toggle() {
          Lampa.Controller.collectionSet(scroll.render(), files.render());
          Lampa.Controller.collectionFocus(last || false, scroll.render());
        },
        up: function up() {
          if (Navigator.canmove('up')) {
            Navigator.move('up');
          } else Lampa.Controller.toggle('head');
        },
        down: function down() {
          Navigator.move('down');
        },
        right: function right() {
          if (Navigator.canmove('right')) Navigator.move('right');
          else if (object.movie.number_of_seasons) filter.show(Lampa.Lang.translate('title_filter'), 'filter');
					else filter.show(Lampa.Lang.translate('online_balanser'), 'sort');
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');else Lampa.Controller.toggle('menu');
        },
        gone: function gone() {
          clearInterval(balanser_timer);
        },
        back: this.back
      });
      Lampa.Controller.toggle('content');
    };
    this.render = function () {
      return files.render();
    };
    this.back = function () {
      Lampa.Activity.backward();
    };
    this.pause = function () {};
    this.stop = function () {};
    this.destroy = function () {
      network.clear();
      this.clearImages();
      files.destroy();
      scroll.destroy();
      clearInterval(balanser_timer);
      if (source) source.destroy();
    };
  }


	function forktv(object) {
  	var network = new Lampa.Reguest();
  	var scroll = new Lampa.Scroll({
  		mask: true,
  		over: true,
  		step: 250
  	});
  	var items = [];
  	var contextmenu_all = [];
  	var html = $('<div class="forktv"></div>');
  	var body = $('<div class="category-full"></div>');
  	var last;
  	var waitload = false;
  	var active = 0;
  	this.create = function () {
  		var _this = this;
  		this.activity.loader(true);
  		if (object.submenu) _this.build(object.url);
  		else {
  			var u = object.url && object.url.indexOf('?') > -1 ? '&' : '?';
  			network.silent(object.url + u + ForkTV.user_dev, function (found) {
  				_this.build(found);
  			}, function (a, c) {
  				_this.build(a);
  				Lampa.Noty.show(network.errorDecode(a, c));
  			});
  		}
  		return this.render();
  	};
  	this.next = function (next_page_url) {
  		var _this2 = this;
  		if (waitload) return;
  		if (object.page < 90) {
  			waitload = true;
  			object.page++;
  			network.silent(next_page_url + '&' + ForkTV.user_dev, function (result) {
  				_this2.append(result);
  				if (result.channels.length) waitload = false;
  				Lampa.Controller.enable('content');
  				_this2.activity.loader(false);
  			}, function (a, c) {
  				Lampa.Noty.show(network.errorDecode(a, c));
  			});
  		}
  	};
  	this.stream = function (data, title, youtube, subs, element, view) {
  		var _this = this;
  		if (data.indexOf('getstream') == -1 && (data.indexOf('rgfoot') > -1 || data.indexOf('torrstream') > -1 || data.indexOf('torrent') > -1)) {
  			this.activity.loader(true);
  			network.timeout(10000);
  			network.silent(data + '&' + ForkTV.user_dev, function (json) {
  				_this.activity.loader(false);
  				if (json.channels.length > 0) {
  					var playlist = [];
  					var data = json.channels[0];
  					if (data.stream_url) {
  						var first = {
  							title: data.title,
  							url: data.stream_url,
  							timeline: view
  						};
  						if (json.channels.length > 1) {
  							json.channels.forEach(function (elem) {
  								playlist.push({
  									title: elem.title,
  									url: elem.stream_url
  								});
  							});
  						} else playlist.push(first);
  						if (playlist.length > 1) first.playlist = playlist;
  						Lampa.Player.play(first);
  						Lampa.Player.playlist(playlist);
  					} else Lampa.Noty.show(data.title);
  				} else Lampa.Noty.show(Lampa.Lang.translate('online_nolink'));
  			}, function (a, e) {
  				_this.activity.loader(false);
  				Lampa.Noty.show(network.errorDecode(a, e));
  			}, false, {
  				dataType: 'json'
  			});
  		} else if (data && data.match(/magnet|videos|stream\?|mp4|mkv|m3u8/i)) {
  			if (object.title == 'IPTV') {
  				Lampa.Activity.push({
  					url: data + '?' + ForkTV.user_dev,
  					title: 'cloneMODS\'s TV',
  					component: 'modss_tv',
  					page: 1
  				});
  			} else {
  				var subtitles = [];
  				if (subs) {
  					subs.forEach(function (e) {
  						subtitles.push({
  							label: e[0],
  							url: e[1]
  						});
  					});
  				}
  				var playlist = [];
  				var first = {
  					title: title,
  					url: data,
  					subtitles: subtitles,
  					timeline: view
  				};
  				if (element.length > 1) {
  					JSON.parse(element).forEach(function (elem) {
  						if (elem.title.match('Описание|Торрент|Трейлер|Страны|Жанр|Похож|Модел|Студи|Катег|Превь|Тег|Порноз') == null) playlist.push({
  							title: elem.title,
  							url: elem.stream_url
  						});
  					});
  				} else playlist.push(first);
  				if (playlist.length > 1) first.playlist = playlist;
  				Lampa.Player.play(first);
  				Lampa.Player.playlist(playlist);
  			}
  		} else if (youtube) {
  			var id = youtube.split('=')[1];
  			if (Lampa.Platform.is('android')) Lampa.Android.openYoutube(id);
  			else _this.YouTube(id);
  		}
  	};
  	this.append = function (data) {
  		var _this3 = this;
  		var viewed = Lampa.Storage.cache('online_view', 5000, []);
  		var bg_img = JSON.stringify(data).replace('background-image', 'background_image');
  		bg_img = JSON.parse(bg_img);
  		bg_img.background_image && Lampa.Background.immediately(bg_img.background_image);
  		if (data.channels && data.channels.length == 0) {
  			Lampa.Noty.show('Ничего не найдено');
  		} else {
  			var json = data.channels && data.menu && data.menu.length > 0 && data.menu[0].title != 'Трейлер' && data.next_page_url && data.next_page_url.indexOf('page=1') > -1 ? data.menu.concat(data.channels) : (object.title == 'SerialHD' && data.next_page_url.split('page=')[1] != 2) ? data.channels.slice(1) : data.channels;
  			json = JSON.stringify(json).replace('<br \/>', '<br>').replace(/\)|\(|%20/g, '');
  			if (data.title == 'HDGO') {
  					[{
  					name: 'Быстрый доступ',
  					id: [0, 1, 2, 3]
  					}, {
  					name: 'Фильмы',
  					id: [4]
  					}, {
  					name: 'Сериалы',
  					id: [5]
  					}, {
  					name: 'Мультфильмы',
  					id: [6]
  					}, {
  					name: 'Мультсериалы',
  					id: [7]
  					}, {
  					name: 'Аниме',
  					id: [8]
  					}, {
  					name: 'Тв-Шоу',
  					id: [9]
  					}, {
  					name: 'Док. Сериалы',
  					id: [10]
  					}, {
  					name: 'Док. Фильмы',
  					id: [11]
  					}].map(function (i) {
  					_this3.appendHdgo({
  						title: i.name,
  						results: JSON.parse(json).filter(function (element) {
  							if (i.id.indexOf(element.coordination[1]) > -1) return element;
  						})
  					});
  				});
  			} else {
  				var element = JSON.parse(json)[0];
  				var infos = element.description ? element.description : element.template;
  				var voic = infos && infos.match(/Озвучка:(.*?)<br/) || infos && infos.match(/Перевод:(.*?)(<br|Разм|Обн|Реж|Вр|Фор)/) || '';
  				if (element.template && element.template.indexOf('film.') > -1 || element.logo_30x30 && element.logo_30x30.match('mediafil') || element.logo_30x30 && element.logo_30x30.match('folder') && element.playlist_url && element.playlist_url.indexOf('torrstream?magnet') > -1) {
  					var image = element.before && element.before.indexOf('src') > -1 ? $('img', element.before).attr('src') : element.template && element.template.indexOf('src') > -1 ? $('img', element.template).attr('src') : element.description && element.description.indexOf('src') > -1 ? $('img', element.description).attr('src') : element.logo_30x30 && element.logo_30x30.indexOf('png') > -1 ? element.logo_30x30 : element.details && element.details.poster ? element.details.poster : './img/icons/film.svg';
  					object.movie = {
  						img: image,
  						title: object.title,
  						original_title: '',
  						id: 1
  					};
  					var files = new Lampa.Files(object);
  					files.append(scroll.render());
  					html.append(files.render());
  					html.find('.selector').unbind('hover:enter').on('hover:enter', function () {
  						if (element.description || element.template) Lampa.Modal.open({
  							title: element.title,
  							size: 'medium',
  							html: $(element.description ? $(element.description).attr('style', '') : element.template),
  							onBack: function onBack() {
  								Lampa.Modal.close();
  								Lampa.Controller.toggle('content');
  							}
  						});
  					});
  				}
  				JSON.parse(json).forEach(function (element) {
  					var stream = element.stream_url ? element.stream_url : element.playlist_url;
  					if (element.title.match('Описание|Трейлер') == null) {
  						if (element.template && element.template.indexOf('film.') > -1 || element.logo_30x30 && element.logo_30x30.match('mediafil') || element.logo_30x30 && element.logo_30x30.match('folder') && element.playlist_url && element.playlist_url.indexOf('torrstream?magnet') > -1) {
  							body.attr('class', '');
  							scroll.body().addClass('torrent-list');
  							element.quality = (voic && voic[0]) || '';
  							element.info = '';
  							if (element.logo_30x30 && element.logo_30x30.match(/folder|mediafil/) && stream && stream.match(/torrstream\?magnet|getstream|kinomix/)) {
  								var des = $(element.template || element.description).text();
  								var vo = des.match(/Озвучка(.*?)Вид/) || des.match(/Перевод:(.*?)Разм/);
  								var vid = des.match(/Видео[:](.*?)[|]/) || des.match(/Видео[:](.*?)Длит/) || des.match(/Видео(.*?)$/);
  								var sed_per = des.match(/Раздают:(.*?)Качают:(.*?)(Обн|Кач|Длит)/) || des.match(/Раздают:(.*?)\s[|]\sКачают:(.*?)(Обн|Кач|Длит)/);
  								var size1 = des.match(/t\/s(.*?)Озв/) || des.match(/Размер:(.*?)Разд/) || $(element.template || element.description).find('.trt-size').text();
  								var sizes = size1 && size1[1] || $(element.template || element.description).find('.trt-size').text();
  								element.quality = '';
  								if (sed_per || vid || sizes || vo) element.info = (sed_per ? '<b style="color:green">&#8679;' + parseInt(sed_per[1]) + '</b><b style="color:red">&#8659;' + parseInt(sed_per[2]) + '</b> - ' : '') + (vo ? vo[1] + ' / ' : '') + (sizes && ' <b>' + sizes + '</b><br><hr>' || '') + (vid ? vid[0].replace(/Аудио|Звук/, ' | Аудио') : '');
  							}
  							var card = Lampa.Template.get('onlines_v1', element);
  							var hash = Lampa.Utils.hash([element.title, element.ident, stream].join(''));
  							var view = Lampa.Timeline.view(hash);
  							var hash_file = Lampa.Utils.hash([element.title, element.ident, stream].join(''));
  							element.timeline = view;
  							card.append(Lampa.Timeline.render(view));
  							if (Lampa.Timeline.details) card.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
  							if (viewed.indexOf(hash_file) !== -1) card.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
  						} else {
  							var image = element.before && element.before.indexOf('src') > -1 ? $('img', element.before).attr('src') : element.template && element.template.indexOf('src') > -1 ? $('img', element.template).attr('src') : element.description && element.description.indexOf('src') > -1 ? $('img', element.description).attr('src') : element.logo_30x30 && element.logo_30x30.indexOf('png') > -1 ? element.logo_30x30 : element.details && element.details.poster ? element.details.poster : './img/icons/film.svg';
  							if (!element.search_on) {
  								var time = $($(element.description).children()[0]).parent().text();
  								time = time.match(/Продолжительность: (.*?)?./i);
  								time = time && time.shift() + ' - ' || '';
  								var descr = !element.ident && element.description && $($(element.description).children()[1]) ? $($(element.description).children()[1]).text().slice(0, 130) || $($(element.description).children()[0]).parent().text().slice(0, 130) : '';
  								var info = element.description ? element.description : element.template;
  								var voice = info && info.match(/Озвучка[:](.*?)(Субтит|<\/div><\/div>|<br)/) || info && info.match(/Перевод:(.*?)(<br|Разм|Обн|Реж|Вр|Фор)/) || '';
  								var size = info && info.match(/(Размер|Size):(.*?)<br/) || '';
  								var qual = info && info.match(/Качество:(.*?)<br/) || '';
  								var qual2 = qual ? qual[1].split(' ')[1] : voice ? voice[1] && voice[1].split('>')[2].trim().split(/,\s|\s/)[0] : '';
  								var rating = $(element.template).find('.a-r').text();
  								var peer = info && info.split(/<br[^>]*>|<\/div>/).find(function (itm) {
  									if (itm.match(/Качают|Скачивают|Leechers/)) return itm;
  								});
  								var seed = info && info.split(/<br[^>]*>|<\/div>/).find(function (itm) {
  									if (itm.match('Раздают|Seeders')) return itm;
  								});
  							}
  							var card = Lampa.Template.get('card', {
  								title: element.title || element.details && element.details.name,
  								release_year: (size && size[0] + ' | ') + voice && voice[1] ? (voice[1].indexOf(',') > -1 ? voice[1].split(',')[0] : voice[1]) : ''
  							});
  							if (rating) card.find('.card__view').append('<div class="card__type a-r' + (rating <= 5 ? ' b' : (rating >= 5 && rating <= 7) ? ' de' : ' g') + '" style="background-color: #ff9455;">' + rating + '</div>');
  							if (qual2) card.find('.card__view').append('<div class="card__quality">' + qual2 + '</div>');
  							if (seed) card.find('.card__view').append('<div class="card__type" style="background:none;font-size:1em;left:-.2em;top:-.5em"><b style="position:relative ;background: green;color: #fff;" class="card__type">' + parseInt(seed.match(/ \d+/) ? seed.match(/ \d+/)[0] : seed.match(/\d+/)[0]) + '</b><b class="card__type" style="position:relative;background: #ff4242;color: #fff;left:-1em!important;border-bottom-left-radius: 0;border-top-left-radius: 0" class="info_peer">' + parseInt(peer.match(/ \d+/) ? peer.match(/ \d+/)[0] : peer.match(/\d+/)[0]) + '</b></div>');
  							card.addClass(isNaN(element.ident) && (element.home || typeof element.details != 'undefined' || element.title == 'Все' || element.title.match(/Всі|Обновлен|жанры|сезон|Наше|Зарубеж|Женск|Муж|Отеч|Фил|Сериал|Мул|Худ/g) !== null || element.template && element.template.indexOf('svg') > -1 || element.logo_30x30 && element.logo_30x30.match(/ttv|right|succes|server|info|cloud|translate|error|trailer|uhd|webcam|mediafile|viewed|new|top|country|genre|similarmenu|filter/g) != null || stream && (stream.indexOf('browse') > -1 || stream.indexOf('viewforum') > -1 || stream.indexOf('me/list?actor=') > -1 || stream.indexOf('genre=') > -1) || element.playlist_url && element.playlist_url.indexOf('actor') == -1 && element.playlist_url && element.playlist_url.indexOf('voice?') == -1 && element.playlist_url && element.playlist_url.match(/cat=|page=|year=|list\?direc|genre|list\?actor|country/g) !== null || element.playlist_url && element.playlist_url.indexOf('view?id') == -1 && element.playlist_url && element.playlist_url.indexOf('stream?id') == -1 && element.playlist_url && element.playlist_url.indexOf('details?') == -1 && object.title.indexOf('HDGO') > -1 || element.logo_30x30 && element.logo_30x30.indexOf('webcam') > -1) ? 'card--collection' : 'card--category');
  							if (!data.landscape && !data.details && ((/iPhone|android/i.test(navigator.userAgent) || Lampa.Platform.is('android')))) card.addClass('mobile');
  							if (/iPhone|x11|nt/i.test(navigator.userAgent) && !Lampa.Platform.is('android')) card.addClass('pc');
  							if (/Mozilla/i.test(navigator.userAgent) && !/Android/i.test(navigator.userAgent) || Lampa.Platform.tv()) card.addClass('tv');
  							if (data.details && !data.details.images && stream && stream.match(/subcategory|submenu|page=|year=|list\?direc|genre|list\?actor|country/g) !== null) card.addClass('mobiles');
  							if (element.description && element.description.indexOf('linear-gradientto') > -1 || data.landscape || data.next_page_url && data.next_page_url.indexOf('girl') > -1) card.addClass('nuam');
  							if (data.next_page_url && data.next_page_url.indexOf('girl') > -1 && stream.indexOf('vporn/list?cat')) card.addClass('card--category').removeClass('card--collection');
  							if (element.logo_30x30 && element.logo_30x30.match(/country|genre|filter|mediafolder/g) != null) card.addClass('hdgo');
  							if (element.logo_30x30 && element.logo_30x30.match(/\/folder\./g) && stream.match(/stream|magnet|view\?|view=|\/details/g)) card.addClass('mobile card--category').removeClass('card--collection');
  							if (element.logo_30x30 && element.logo_30x30.indexOf('/folder.') > -1 && stream.match(/view=/g)) card.addClass('card--category hdgo').removeClass('card--collection nuam mobile');
  							if (element.logo_30x30 && element.logo_30x30.match(/mediafolder/g)) card.addClass('card--category').removeClass('card--collection');
  							if (bg_img.background_image && bg_img.background_image.indexOf('18') > -1 && ((data.next_page_url && data.next_page_url.indexOf('girl') > -1) && stream.match(/pornst|models/g) !== null)) card.addClass('card--category').removeClass('nuam hdgo mobile card--collection');
  							if (image && image.indexOf('film.svg') > -1) card.addClass('card--collection nuam');
  							if (bg_img.background_image && bg_img.background_image.indexOf('18') > -1 && stream.match(/view\?|hdporn|channel=/g)) card.addClass('card--collection').removeClass('nuam hdgo mobile card--category');
  							if (object.title.match(/Торренты|ForkTV|18\+/g)) card.addClass('home');
  							if (element.logo_30x30 && element.logo_30x30.match(/country|genre|filter/g)) card.addClass('sort');
  							if ((stream && stream.match(/filmix\?subcategory|rutor/) || element.submenu && element.submenu[0] && element.submenu[0].playlist_url && element.submenu[0].playlist_url.indexOf('rutor') > -1) && element.logo_30x30 && element.logo_30x30.match(/filter/g)) card.addClass('two');
  							if (element.title == 'Поиск' && (stream && stream.match(/coldfilm/) || object.title == 'SerialHD')) card.addClass('searc');
  							var img = card.find('img')[0];
  							img.onload = function () {
  								card.addClass('card--loaded');
  							};
  							img.onerror = function (e) {
  								img.src = './img/img_broken.svg';
  							};
  							var picture = image && image.indexOf('yandex') > -1 ? 'https://cors.eu.org/' + image : image && image.indexOf('svg') > -1 ? image : image;
  							img.src = image;
  						}
  						//console.log ('class', card[0].className, window.innerWidth)
  						card.on('hover:focus', function () {
  							if (this.className.indexOf('card--category') > -1) {
  								if (Lampa.Helper) Lampa.Helper.show('online_file', 'Удерживайте клавишу (ОК) для просмотра описания', card);
  								//Lampa.Background.immediately(image);
  							}
  							last = card[0];
  							scroll.update(card, true);
  							var maxrow = Math.ceil(items.length / 7) - 1;
  							if (Math.ceil(items.indexOf(card) / 7) >= maxrow)
  								if (data.next_page_url) _this3.next(data.next_page_url);
  						}).on('hover:enter', function () {
  							if (stream || data.channels.length > 0) {
  								if (element.event || (stream && stream.match(/youtube|stream\?|mp4|mkv|m3u8/i))) {
  									_this3.stream(stream, element.title, element.infolink || element.stream_url, element.subtitles, json, view);
  									if (viewed.indexOf(hash_file) == -1) {
  										viewed.push(hash_file);
  										card.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
  										Lampa.Storage.set('online_view', viewed);
  									}
  								} else if (element.search_on) {
  									Lampa.Input.edit({
  										value: element.playlist_url.indexOf('newserv') > -1 && Lampa.Storage.get('server_ip') ? Lampa.Storage.get('server_ip') : '',
  										free: true
  									}, function (new_value) {
  										if (new_value == '') {
  											Lampa.Controller.toggle('content');
  											return;
  										}
  										if (element.playlist_url.indexOf('newserv') > -1) Lampa.Storage.set('server_ip', new_value);
  										var query = element.playlist_url.indexOf('newserv') > -1 ? Lampa.Storage.get('server_ip') : new_value;
  										var u = element.playlist_url && element.playlist_url.indexOf('?') > -1 ? '&' : '/?';
  										network.silent(element.playlist_url + u + 'search=' + query + '&' + ForkTV.user_dev, function (json) {
  											if (json.channels && json.channels[0].title.indexOf('по запросу') > -1) {
  												if (json.channels.length == 0) {
  													Lampa.Controller.toggle('content');
  													return;
  												}
  												Lampa.Modal.open({
  													title: '',
  													size: 'medium',
  													html: Lampa.Template.get('error', {
  														title: 'Ошибка',
  														text: json.channels[0].title
  													}),
  													onBack: function onBack() {
  														Lampa.Modal.close();
  														Lampa.Controller.toggle('content');
  													}
  												});
  											} else {
  												Lampa.Activity.push({
  													title: element.title,
  													url: json,
  													submenu: true,
  													component: 'forktv',
  													page: 1
  												});
  											}
  										});
  									});
  								} else if (stream == '' || image.indexOf('info.png') > -1) {
  									Lampa.Modal.open({
  										title: element.title,
  										size: 'medium',
  										html: $('<div style="font-size:4vw">' + $(element.description)[0].innerHTML + '</div>'),
  										onBack: function onBack() {
  											Lampa.Modal.close();
  											Lampa.Controller.toggle('content');
  										}
  									});
  								} else if (stream) {
  									var goto = function goto() {
  										var title = /*stream == 'submenu' ? element.submenu && element.submenu[0].title : */ element.details && element.details.title ? element.details.title : element.title && element.title.indexOf('l-count') > -1 ? element.title.split(' ').shift() : element.details && element.details.name ? element.details.name : element.title;
  										//console.log (element.submenu)
  										var url = stream == 'submenu' ? {
  											channels: element.submenu
  										} : stream;
  										Lampa.Activity.push({
  											title: title,
  											url: url,
  											submenu: stream == 'submenu',
  											component: 'forktv',
  											page: 1
  										});
  									};
  									if (element.title == '18+' && Lampa.Storage.get('mods_password')) {
  										Lampa.Input.edit({
  											value: "",
  											title: "Введите пароль доступа",
  											free: true,
  											nosave: true
  										}, function (t) {
  											if (Lampa.Storage.field('mods_password') == t) goto();
  											else {
  												Lampa.Noty.show('Неверный пароль.');
  												Lampa.Controller.toggle('content');
  											}
  										});
  									} else goto();
  								} else if (element.description && element.description.indexOf('доступа') > -1) {
  									ForkTV.checkAdd('content');
  								}
  							}
  						}).on('hover:long', function () {
  							if (stream && stream.match('bonga|chatur|rgfoot') == null && stream.match(/stream\?|mp4|mkv|m3u8/i)) {
  								_this3.contextmenu({
  									item: card,
  									view: view,
  									viewed: viewed,
  									hash_file: hash_file,
  									file: stream
  								});
  							}
  							if ((element.template || element.description) && stream && stream.match('torrstream|getstream|mp4|kinomix') == null && stream.match(/viewtube|details|season|view\?|voice|magnet|stream\?id|mp4|m3u8/i) && (element.description || element.template)) {
  								Lampa.Modal.open({
  									title: element.title,
  									size: 'medium',
  									html: $(element.description ? $(element.description).attr('style', '') : element.template),
  									onBack: function onBack() {
  										Lampa.Modal.close();
  										Lampa.Controller.toggle('content');
  									}
  								});
  							}
  						});
  						body.append(card);
  						items.push(card);
  					}
  				});
  			}
  		}
  	};
  	this.build = function (data) {
  		if (data.channels && data.channels.length) {
  			scroll.minus();
  			html.append(scroll.render());
  			this.append(data);
  			scroll.append(body);
  			this.activity.toggle();
  		} else {
  			this.activity.toggle();
  			html.append(scroll.render());
  			this.empty();
  		}
  		this.activity.loader(false);
  	};
  	this.createHdGO = function (data) {
  		var content = Lampa.Template.get('items_line', {
  			title: data.title
  		});
  		var body = content.find('.items-line__body');
  		var scroll = new Lampa.Scroll({
  			horizontal: true,
  			step: 300
  		});
  		var items = [];
  		var active = 0;
  		var last;
  		this.create = function () {
  			scroll.render().find('.scroll__body').addClass('items-cards');
  			content.find('.items-line__title').text(data.title);
  			data.results.forEach(this.append.bind(this));
  			body.append(scroll.render());
  		};
  		this.item = function (data) {
  			var item = Lampa.Template.get('hdgo_item', {
  				title: data.title
  			});
  			if (/iPhone|x11|nt|Mozilla/i.test(navigator.userAgent) || Lampa.Platform.tv()) item.addClass('card--collection').find('.card__age').remove();
  			if (/iPhone|x11|nt/i.test(navigator.userAgent) && !Lampa.Platform.is('android')) item.addClass('hdgo pc');
  			if (Lampa.Platform.tv()) item.addClass('hdgo tv');
  			var logo = data.logo_30x30 ? data.logo_30x30 : data.template && data.template.indexOf('src') > -1 ? $('img', data.template).attr('src') : 'img/actor.svg';
  			var img = item.find('img')[0];
  			img.onerror = function () {
  				img.src = './img/img_broken.svg';
  			};
  			img.src = logo;
  			this.render = function () {
  				return item;
  			};
  			this.destroy = function () {
  				img.onerror = function () {};
  				img.onload = function () {};
  				img.src = '';
  				item.remove();
  			};
  		};
  		this.append = function (element) {
  			var _this = this;
  			var item$1 = new _this.item(element);
  			item$1.render().on('hover:focus', function () {
  				last = item$1.render()[0];
  				active = items.indexOf(item$1);
  				scroll.update(items[active].render(), true);
  			}).on('hover:enter', function () {
  				if (element.search_on) {
  					Lampa.Input.edit({
  						value: '',
  						free: true
  					}, function (new_value) {
  						var query = new_value;
  						var u = element.playlist_url && element.playlist_url.indexOf('?') > -1 ? '&' : '/?';
  						network.silent(element.playlist_url + u + 'search=' + query + '&' + ForkTV.user_dev, function (json) {
  							if (json.channels[0].title.indexOf('Нет результатов') == -1) {
  								Lampa.Activity.push({
  									title: element.title,
  									url: json,
  									submenu: true,
  									component: 'forktv',
  									page: 1
  								});
  							} else {
  								Lampa.Modal.open({
  									title: '',
  									size: 'medium',
  									html: Lampa.Template.get('error', {
  										title: 'Ошибка',
  										text: json.channels[0].title
  									}),
  									onBack: function onBack() {
  										Lampa.Modal.close();
  										Lampa.Controller.toggle('content');
  									}
  								});
  							}
  						});
  					});
  				} else {
  					Lampa.Activity.push({
  						title: element.title,
  						url: element.playlist_url,
  						submenu: false,
  						component: 'forktv',
  						page: 1
  					});
  				}
  			});
  			scroll.append(item$1.render());
  			items.push(item$1);
  		};
  		this.toggle = function () {
  			var _this = this;
  			Lampa.Controller.add('hdgo_line', {
  				toggle: function toggle() {
  					Lampa.Controller.collectionSet(scroll.render());
  					Lampa.Controller.collectionFocus(last || false, scroll.render());
  				},
  				right: function right() {
  					Navigator.move('right');
  					Lampa.Controller.enable('hdgo_line');
  				},
  				left: function left() {
  					if (Navigator.canmove('left')) Navigator.move('left');
  					else if (_this.onLeft) _this.onLeft();
  					else Lampa.Controller.toggle('menu');
  				},
  				down: this.onDown,
  				up: this.onUp,
  				gone: function gone() {},
  				back: this.onBack
  			});
  			Lampa.Controller.toggle('hdgo_line');
  		};
  		this.render = function () {
  			return content;
  		};
  		this.destroy = function () {
  			Lampa.Arrays.destroy(items);
  			scroll.destroy();
  			content.remove();
  			items = null;
  		};
  	};
  	this.appendHdgo = function (data) {
  		var _this = this;
  		var item = new _this.createHdGO(data);
  		item.create();
  		item.onDown = this.down.bind(this);
  		item.onUp = this.up.bind(this);
  		item.onBack = this.back.bind(this);
  		scroll.append(item.render());
  		items.push(item);
  	};
  	this.YouTube = function (id) {
  		var player, html$7, timer$1;
  
  		function create$f(id) {
  			html$7 = $('<div class="youtube-player"><div id="youtube-player"></div><div id="youtube-player__progress" class="youtube-player__progress"></div></div>');
  			$('body').append(html$7);
  			player = new YT.Player('youtube-player', {
  				height: window.innerHeight,
  				width: window.innerWidth,
  				playerVars: {
  					'controls': 0,
  					'showinfo': 0,
  					'autohide': 1,
  					'modestbranding': 1,
  					'autoplay': 1
  				},
  				videoId: id,
  				events: {
  					onReady: function onReady(event) {
  						event.target.playVideo();
  						update$2();
  					},
  					onStateChange: function onStateChange(state) {
  						if (state.data == 0) {
  							Lampa.Controller.toggle('content');
  						}
  					}
  				}
  			});
  		}
  
  		function update$2() {
  			timer$1 = setTimeout(function () {
  				var progress = player.getCurrentTime() / player.getDuration() * 100;
  				$('#youtube-player__progress').css('width', progress + '%');
  				update$2();
  			}, 400);
  		}
  
  		function play(id) {
  			create$f(id);
  			Lampa.Controller.add('youtube', {
  				invisible: true,
  				toggle: function toggle() {},
  				right: function right() {
  					player.seekTo(player.getCurrentTime() + 10, true);
  				},
  				left: function left() {
  					player.seekTo(player.getCurrentTime() - 10, true);
  				},
  				enter: function enter() {},
  				gone: function gone() {
  					destroy$2();
  				},
  				back: function back() {
  					Lampa.Controller.toggle('content');
  				}
  			});
  			Lampa.Controller.toggle('youtube');
  		}
  
  		function destroy$2() {
  			clearTimeout(timer$1);
  			player.destroy();
  			html$7.remove();
  			html$7 = null;
  		}
  		play(id);
  	};
  	this.contextmenu = function (params) {
  		var _this = this;
  		contextmenu_all.push(params);
  		var enabled = Lampa.Controller.enabled().name;
  		var menu = [{
  			title: Lampa.Lang.translate('torrent_parser_label_title'),
  			mark: true
  			}, {
  			title: Lampa.Lang.translate('torrent_parser_label_cancel_title'),
  			clearmark: true
  			}, {
  			title: Lampa.Lang.translate('online_title_clear_all_mark'),
  			clearmark_all: true
  			}, {
  			title: Lampa.Lang.translate('time_reset'),
  			timeclear: true
  			}, {
  			title: Lampa.Lang.translate('online_title_clear_all_timecode'),
  			timeclear_all: true
  			}, {
  			title: Lampa.Lang.translate('copy_link'),
  			copylink: true
  			}];
  		if (Lampa.Platform.is('webos')) {
  			menu.push({
  				title: Lampa.Lang.translate('player_lauch') + ' - Webos',
  				player: 'webos'
  			});
  		}
  		if (Lampa.Platform.is('android')) {
  			menu.push({
  				title: Lampa.Lang.translate('player_lauch') + ' - Android',
  				player: 'android'
  			});
  		}
  		menu.push({
  			title: Lampa.Lang.translate('player_lauch') + ' - Lampa',
  			player: 'lampa'
  		});
  		Lampa.Select.show({
  			title: Lampa.Lang.translate('title_action'),
  			items: menu,
  			onBack: function onBack() {
  				Lampa.Controller.toggle(enabled);
  			},
  			onSelect: function onSelect(a) {
  				if (a.clearmark) {
  					Lampa.Arrays.remove(params.viewed, params.hash_file);
  					Lampa.Storage.set('online_view', params.viewed);
  					params.item.find('.torrent-item__viewed').remove();
  				}
  				if (a.clearmark_all) {
  					contextmenu_all.forEach(function (params) {
  						Lampa.Arrays.remove(params.viewed, params.hash_file);
  						Lampa.Storage.set('online_view', params.viewed);
  						params.item.find('.torrent-item__viewed').remove();
  					});
  				}
  				if (a.mark) {
  					if (params.viewed.indexOf(params.hash_file) == -1) {
  						params.viewed.push(params.hash_file);
  						params.item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
  						Lampa.Storage.set('online_view', params.viewed);
  					}
  				}
  				if (a.timeclear) {
  					params.view.percent = 0;
  					params.view.time = 0;
  					params.view.duration = 0;
  					Lampa.Timeline.update(params.view);
  					Lampa.Arrays.remove(params.viewed, params.hash_file);
  					params.item.find('.torrent-item__viewed').remove();
  					Lampa.Storage.set('online_view', params.viewed);
  				}
  				if (a.timeclear_all) {
  					contextmenu_all.forEach(function (params) {
  						params.view.percent = 0;
  						params.view.time = 0;
  						params.view.duration = 0;
  						Lampa.Timeline.update(params.view);
  						Lampa.Arrays.remove(params.viewed, params.hash_file);
  						params.item.find('.torrent-item__viewed').remove();
  						Lampa.Storage.set('online_view', params.viewed);
  					});
  				}
  				Lampa.Controller.toggle(enabled);
  				if (a.player) {
  					Lampa.Player.runas(a.player);
  					params.item.trigger('hover:enter');
  				}
  				if (a.copylink) {
  					Lampa.Utils.copyTextToClipboard(params.file, function () {
  						Lampa.Noty.show(Lampa.Lang.translate('copy_secuses'));
  					}, function () {
  						Lampa.Noty.show(Lampa.Lang.translate('copy_error'));
  					});
  				}
  			}
  		});
  	};
  	this.empty = function () {
  		var empty = new Lampa.Empty();
  		scroll.append(empty.render());
  		this.start = empty.start;
  		this.activity.loader(false);
  		this.activity.toggle();
  	};
  	this.start = function () {
  		Lampa.Controller.add('content', {
  			toggle: function toggle() {
  				if (object.title == 'HDGO' && items.length) {
  					items[active].toggle();
  				} else {
  					Lampa.Controller.collectionSet(scroll.render(), html);
  					Lampa.Controller.collectionFocus(last || false, scroll.render());
  				}
  			},
  			left: function left() {
  				if (Navigator.canmove('left')) {
  					Navigator.move('left');
  				} else Lampa.Controller.toggle('menu');
  			},
  			right: function right() {
  				Navigator.move('right');
  			},
  			up: function up() {
  				if (Navigator.canmove('up')) Navigator.move('up');
  				else Lampa.Controller.toggle('head');
  			},
  			down: function down() {
  				if (Navigator.canmove('down')) Navigator.move('down');
  			},
  			back: this.back
  		});
  		Lampa.Controller.toggle('content');
  	};
  	this.down = function () {
  		active++;
  		active = Math.min(active, items.length - 1);
  		items[active].toggle();
  		scroll.update(items[active].render());
  	};
  	this.up = function () {
  		active--;
  		if (active < 0) {
  			active = 0;
  			Lampa.Controller.toggle('head');
  		} else {
  			items[active].toggle();
  		}
  		scroll.update(items[active].render());
  	};
  	this.back = function () {
  		Lampa.Activity.backward();
  	};
  	this.pause = function () {};
  	this.stop = function () {};
  	this.render = function () {
  		return html;
  	};
  	this.destroy = function () {
  		network.clear();
  		scroll.destroy();
  		html.remove();
  		body.remove();
  		network = null;
  		items = null;
  		html = null;
  		body = null;
  	};
  }


	function collection(object) {
		var network = new Lampa.Reguest();
		var scroll = new Lampa.Scroll({
			mask: true,
			over: true,
			step: 250
		});
		var items = [];
		var html = $('<div></div>');
		var body = $('<div class="category-full"></div>');
		var cors = object.sour == 'rezka' || object.sourc == 'rezka' ? 'http://prox.lampa.stream/' : object.sour == 'filmix' || object.sourc == 'filmix' ? 'http://corsanywhere.herokuapp.com/' : '';
		var cache = Lampa.Storage.cache('my_col', 5000, {});
		var info;
		var last;
		var waitload = false;
		var relises = [];
		var total_pages;
		this.create = function () {
			var _this = this;
			var url;
			if (object.sourc == 'my_coll') {
				_this.build({
					card: cache
				});
			} else {
				if (object.card && isNaN(object.id)) url = object.id;
				else if (object.sourc == 'pub') {
					if (object.search) url = object.url + '?title=' + object.search + '&sort=views-&access_token=' + Pub.token;
					else url = object.url + '?sort=' + (object.sort ? object.sort : 'views-') + '&access_token=' + Pub.token;
				} else url = object.url;
				if ((object.page == 1 && object.card_cat) || object.cards || (!object.card && !Lampa.Storage.field('light_version') && object.card_cat)) {
					this.activity.loader(true);
					network.silent(cors + url, function (str) {
						var data = _this.card(str);
						_this.build(data);
						if (object.card) $('.head__title').append(' - ' + data.card.length);
					}, function (a, c) {
						Lampa.Noty.show(network.errorDecode(a, c));
					}, false, {
						dataType: 'text'
					});
				} else _this.build(object.data);
			}
			return this.render();
		};
		this.next = function (page) {
			var _this2 = this;
			var url;
			if (total_pages == 0 || total_pages == page) waitload = true;
			if (waitload) return;
			waitload = true;
			object.page++;
			network.clear();
			network.timeout(1000 * 40);
			if (typeof page == 'undefined') return;
			if (object.sourc == 'pub') url = object.url + '?page=' + page + '&sort=' + (object.sort ? object.sort : 'views-') + '&access_token=' + Pub.token;
			else url = page;
			network.silent(cors + url, function (result) {
				var data = _this2.card(result);
				object.data = data;
				_this2.append(data);
				if (data.card.length) waitload = false;
				Lampa.Controller.toggle('content');
				_this2.activity.loader(false);
			}, function (a, c) {
				Lampa.Noty.show(network.errorDecode(a, c));
			}, false, {
				dataType: 'text'
			});
		};
		this.append = function (data) {
			var _this1 = this;
			var datas = Lampa.Arrays.isArray(data.card) ? data.card : Lampa.Arrays.getValues(data.card).reverse();
			datas.forEach(function (element) {
				var card = new Lampa.Card(element, {
					card_category: object.sourc == 'my_coll' || object.sourc == 'pub' || object.sourc == 'filmix' || !object.card_cat || object.cards ? true : false,
					card_collection: object.sourc == 'my_coll' || object.sourc == 'pub' || object.sourc == 'filmix' || !object.card_cat || object.cards ? false : true,
					object: object
				});
				card.create();
				if (object.category && (element.watch || element.quantity)) card.card.find('.card__view').append('<div style="background-color: rgba(0,0,0, 0.7);padding:.5em;position:absolute;border-radius:.3em;right:3;bottom:3">' + (element.watch || element.quantity) + '</div>');
				card.onFocus = function (target, card_data) {
					last = target;
					scroll.update(card.render(), true);
					Lampa.Background.change(card_data.img);
					if (!Lampa.Platform.tv() || !Lampa.Storage.field('light_version')) {
						var maxrow = Math.ceil(items.length / 7) - 1;
						if (Math.ceil(items.indexOf(card) / 7) >= maxrow) _this1.next(data.page);
					}
				};
				card.onEnter = function (target, card_data) {
					if (object.sour == 'rezka' || object.sour == 'filmix' || (Lampa.Storage.field('light_version') && !object.cards) && !object.card_cat || object.cards) {
						Lampa.Api.search({
							query: encodeURIComponent(element.title_org)
						}, function (find) {
							var finded = _this1.finds(element, find);
							if (finded) {
								Lampa.Activity.push({
									url: '',
									component: 'full',
									id: finded.id,
									method: finded.name ? 'tv' : 'movie',
									card: finded
								});
							} else {
								Lampa.Noty.show(Lampa.Lang.translate('nofind_movie'));
								Lampa.Controller.toggle('content');
							}
						}, function () {
							Lampa.Noty.show(Lampa.Lang.translate('nofind_movie'));
							Lampa.Controller.toggle('content');
						});
					} else if (object.sourc == 'pub' || object.sourc == 'my_coll') {
						Lampa.Activity.push({
							title: element.title,
							url: object.url + '/view?id=' + (object.sourc == 'my_coll' ? element.id : element.url) + '&access_token=' + Pub.token,
							sourc: 'pub',
							sour: element.source,
							source: 'pub',
							id: element.url,
							card: element,
							card_cat: true,
							component: !object.category ? 'full' : 'collection',
							page: 1
						});
					} else {
						Lampa.Activity.push({
							title: element.title,
							url: element.url,
							component: 'collection',
							cards: true,
							sourc: object.sourc,
							source: object.source,
							page: 1
						});
					}
				};
				card.onMenu = function (target, data) {
					var _this2 = this;
					var enabled = Lampa.Controller.enabled().name;
					var status = Lampa.Favorite.check(data);
					var items = [];
					if (object.category) {
						items.push({
							title: cache['id_' + data.id] ? Lampa.Lang.translate('card_my_clear') : Lampa.Lang.translate('card_my_add'),
							subtitle: Lampa.Lang.translate('card_my_descr'),
							where: 'book'
						});
					} else {
						items.push({
							title: status.book ? Lampa.Lang.translate('card_book_remove') : Lampa.Lang.translate('card_book_add'),
							subtitle: Lampa.Lang.translate('card_book_descr'),
							where: 'book'
						}, {
							title: status.like ? Lampa.Lang.translate('card_like_remove') : Lampa.Lang.translate('card_like_add'),
							subtitle: Lampa.Lang.translate('card_like_descr'),
							where: 'like'
						}, {
							title: status.wath ? Lampa.Lang.translate('card_wath_remove') : Lampa.Lang.translate('card_wath_add'),
							subtitle: Lampa.Lang.translate('card_wath_descr'),
							where: 'wath'
						}, {
							title: status.history ? Lampa.Lang.translate('card_history_remove') : Lampa.Lang.translate('card_history_add'),
							subtitle: Lampa.Lang.translate('card_history_descr'),
							where: 'history'
						});
					}
					if (object.sourc == 'my_coll') {
						items.push({
							title: Lampa.Lang.translate('card_my_clear_all'),
							subtitle: Lampa.Lang.translate('card_my_clear_all_descr'),
							where: 'clear'
						});
					}
					Lampa.Select.show({
						title: Lampa.Lang.translate('title_action'),
						items: items,
						onBack: function onBack() {
							Lampa.Controller.toggle(enabled);
						},
						onSelect: function onSelect(a) {
							if (a.where == 'clear') {
								Lampa.Storage.set('my_col', '');
								Lampa.Activity.push({
									url: object.url,
									sourc: object.sourc,
									source: object.source,
									title: object.title,
									card_cat: true,
									category: true,
									component: 'collection',
									page: 1
								});
								Lampa.Noty.show(Lampa.Lang.translate('saved_collections_clears'));
							} else if (object.category) {
								data.source = object.sourc;
								_this1.favorite(data, card.card);
							} else {
								if (object.sour == 'filmix' || object.sour == 'rezka' || object.sourc == 'rezka' || object.sourc == 'filmix') {
									Lampa.Api.search({
										query: encodeURIComponent(data.title_org)
									}, function (find) {
										var finded = _this1.finds(data, find);
										if (finded) {
											finded.url = (finded.name ? 'tv' : 'movie') + '/' + finded.id;
											Lampa.Favorite.toggle(a.where, finded);
										} else {
											Lampa.Noty.show(Lampa.Lang.translate('nofind_movie'));
											Lampa.Controller.toggle('content');
										}
									}, function () {
										Lampa.Noty.show(Lampa.Lang.translate('nofind_movie'));
										Lampa.Controller.toggle('content');
									});
								} else {
									data.source = object.source;
									Lampa.Favorite.toggle(a.where, data);
								}
								_this2.favorite();
							}
							Lampa.Controller.toggle(enabled);
						}
					});
				};
				if (cache['id_' + element.id]) _this1.addicon('book', card.card);
				card.visible();
				body.append(card.render());
				items.push(card);
			});
		};
		this.addicon = function (name, card) {
			card.find('.card__icons-inner').append('<div class="card__icon icon--' + name + '"></div>');
		};
		this.favorite = function (data, card) {
			var _this = this;
			if (!cache['id_' + data.id]) {
				cache['id_' + data.id] = data;
				Lampa.Storage.set('my_col', cache);
			} else {
				delete cache['id_' + data.id];
				Lampa.Storage.set('my_col', cache);
				Lampa.Activity.push({
					url: object.url,
					sourc: object.sourc,
					source: object.source,
					title: object.title,
					card_cat: true,
					category: true,
					component: 'collection',
					page: 1
				});
			}
			card.find('.card__icon').remove();
			if (cache['id_' + data.id]) _this.addicon('book', card);
		};
		this.build = function (data) {
			if (data.card.length || Lampa.Arrays.getKeys(data.card).length) {
				Lampa.Template.add('info_coll', Lampa.Lang.translate('<div class="info layer--width" style="height:6.2em"><div class="info__left"><div class="info__title"></div><div class="info__title-original"></div><div class="info__create"></div><div class="full-start__button selector view--category"><svg version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\"><path fill=\"currentColor\" d=\"M225.474,0C101.151,0,0,101.151,0,225.474c0,124.33,101.151,225.474,225.474,225.474c124.33,0,225.474-101.144,225.474-225.474C450.948,101.151,349.804,0,225.474,0z M225.474,409.323c-101.373,0-183.848-82.475-183.848-183.848S124.101,41.626,225.474,41.626s183.848,82.475,183.848,183.848S326.847,409.323,225.474,409.323z\"/><path fill=\"currentColor\" d=\"M505.902,476.472L386.574,357.144c-8.131-8.131-21.299-8.131-29.43,0c-8.131,8.124-8.131,21.306,0,29.43l119.328,119.328c4.065,4.065,9.387,6.098,14.715,6.098c5.321,0,10.649-2.033,14.715-6.098C514.033,497.778,514.033,484.596,505.902,476.472z\"/></svg>   <span>#{pub_search_coll}</span> </div></div><div class="info__right">  <div class="full-start__button selector view--filter"><svg style=\"enable-background:new 0 0 512 512;\" version=\"1.1\" viewBox=\"0 0 24 24\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><g id=\"info\"/><g id=\"icons\"><g id=\"menu\"><path d=\"M20,10H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2C22,10.9,21.1,10,20,10z\" fill=\"currentColor\"/><path d=\"M4,8h12c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2H4C2.9,4,2,4.9,2,6C2,7.1,2.9,8,4,8z\" fill=\"currentColor\"/><path d=\"M16,16H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2C18,16.9,17.1,16,16,16z\" fill=\"currentColor\"/></g></g></svg>  <span>#{title_filter}</span></div></div></div>'));
				info = Lampa.Template.get('info_coll');
				info.find('.view--category').on('hover:enter hover:click', function () {
					Lampa.Input.edit({
						value: '',
						free: true
					}, function (name) {
						if (name == '') {
							Lampa.Controller.toggle('content');
							return;
						}
						Lampa.Activity.push({
							title: 'Поиск по - ' + name,
							url: Pub.baseurl + 'v1/collections',
							component: 'collection',
							search: name,
							card_cat: true,
							category: true,
							sourc: 'pub',
							source: 'pub',
							page: 1
						});
					});
				});
				info.find('.view--filter').on('hover:enter hover:click', function () {
					var enabled = Lampa.Controller.enabled().name;
					var items = [{
						title: Lampa.Lang.translate('pub_sort_views'),
						id: 'views-'
					}, {
						title: Lampa.Lang.translate('pub_sort_watchers'),
						id: 'watchers-'
					}, {
						title: Lampa.Lang.translate('pub_sort_updated'),
						id: 'updated-'
					}, {
						title: Lampa.Lang.translate('pub_sort_created'),
						id: 'created-'
					}].filter(function (el, i) {
						if (object.sort == el.id) el.selected = true;
						return el;
					});
					Lampa.Select.show({
						title: Lampa.Lang.translate('title_filter'),
						items: items,
						onBack: function onBack() {
							Lampa.Controller.toggle(enabled);
						},
						onSelect: function onSelect(a) {
							Lampa.Activity.push({
								title: Lampa.Lang.translate('title_filter') + ' ' + a.title.toLowerCase(),
								url: Pub.baseurl + 'v1/collections',
								component: 'collection',
								sort: a.id,
								card_cat: true,
								category: true,
								sourc: 'pub',
								source: 'pub',
								page: 1
							});
						}
					});
				});
				scroll.render().addClass('layer--wheight').data('mheight', info);
				if (object.sourc == 'pub' && object.category) html.append(info);
				html.append(scroll.render());
				this.append(data);
				if (Lampa.Platform.tv() && Lampa.Storage.field('light_version')) this.more(data);
				scroll.append(body);
				this.activity.loader(false);
				this.activity.toggle();
			} else {
				html.append(scroll.render());
				this.empty(object.search ? object.search : '');
			}
		};
		this.empty = function (query) {
			var empty = new Lampa.Empty();
			if (query) empty = new Lampa.Empty({
				descr: Lampa.Lang.translate('online_query_start') + ' (' + query + ') ' + Lampa.Lang.translate('online_query_end'),
				title: ''
			});
			scroll.append(empty.render());
			this.start = empty.start;
			this.activity.loader(false);
			this.activity.toggle();
		};
		this.more = function (data) {
			var _this = this;
			var more = $('<div class="category-full__more selector"><span>' + Lampa.Lang.translate('show_more') + '</span></div>');
			more.on('hover:focus', function (e) {
				Lampa.Controller.collectionFocus(last || false, scroll.render());
				var next = Lampa.Arrays.clone(object);
				if (data.total_pages == 0 || data.total_pages == undefined) {
					more.remove();
					return;
				}
				network.clear();
				network.timeout(1000 * 20);
				var url;
				if (object.sourc == 'pub') url = object.url + '?page=' + data.page + '&sort=' + (object.sort ? object.sort : 'views-') + '&access_token=' + Pub.token;
				else url = data.page;
				network.silent(cors + url, function (result) {
					var card = _this.card(result);
					next.data = card;
					if (object.cards) next.cards = false;
					delete next.activity;
					next.page++;
					if (card.card.length == 0) more.remove();
					else Lampa.Activity.push(next);
				}, function (a, c) {
					Lampa.Noty.show(network.errorDecode(a, c));
				}, false, {
					dataType: 'text'
				});
			});
			body.append(more);
		};
		this.back = function () {
			last = items[0].render()[0];
			var more = $('<div class="selector" style="width: 100%; height: 5px"></div>');
			more.on('hover:focus', function (e) {
				if (object.page > 1) {
					Lampa.Activity.backward();
				} else {
					Lampa.Controller.toggle('head');
				}
			});
			body.prepend(more);
		};
		this.card = function (str) {
			var card = [];
			var page;
			if (object.sourc != 'pub') str = str.replace(/\n/g, '');
			if (object.card && object.card.source == 'rezka' || object.sourc == 'rezka') {
				var h = $('.b-content__inline_item', str).length ? $('.b-content__inline_item', str) : $('.b-content__collections_item', str);
				total_pages = $('.b-navigation', str).find('a:last-child').length;
				page = $('.b-navigation', str).find('a:last-child').attr('href');
				$(h).each(function (i, html) {
					card.push({
						id: $('a', html).attr('href').split('-')[0].split('/').pop(),
						title: $('a:eq(1)', html).text().split(' / ').shift() || $('.title', html).text(),
						title_org: $('a:eq(1)', html).text().split(' / ').shift(),
						url: $('a', html).attr('href'),
						img: $('img', html).attr('src'),
						quantity: $('.num', html).text() + ' видео',
						year: $('div:eq(2)', html).text().split(' - ').shift()
					});
				});
			} else if (object.card && object.card.source == 'filmix' || object.sourc == 'filmix') {
				var d = $('.playlist-articles', str);
				var str = d.length ? d.html() : $('.m-list-movie', str).html();
				$(str).each(function (i, html) {
					if (html.tagName == 'DIV') {
						page = $(html).find('.next').attr('href');
						total_pages = $(html).find('a:last-child').length;
					}
					if (html.tagName == 'ARTICLE') card.push({
						id: $('a', html).attr('href').split('-')[0].split('/').pop(),
						title: $('.m-movie-title', html).text() || ($('.poster', html).attr('alt') && $('.poster', html).attr('alt').split(',').shift()),
						title_org: $('.m-movie-original', html).text() || $('.origin-name', html).text(),
						url: $('a', html).attr('href'),
						img: $('img', html).attr('src'),
						quantity: $('.m-movie-quantity', html).text() || $('.count', html).text(),
						year: $('.grid-item', html).text() || ($('.poster', html).attr('alt') && $('.poster', html).attr('alt').split(',').pop())
					});
				});
			} else if (object.card && object.card.source == 'pub' || object.sourc == 'pub') {
				str = JSON.parse(str);
				if (str.pagination) {
					total_pages = str.pagination.total + 1;
					page = str.pagination.current + 1;
				}
				if (str.items) str.items.forEach(function (element) {
					card.push({
						url: element.id,
						id: element.id,
						watch: element.views + '/' + element.watchers,
						title: element.title.split('/')[0],
						original_title: element.title.split('/')[1] || element.title,
						release_date: (element.year ? element.year + '' : element.years ? element.years[0] + '' : '0000'),
						first_air_date: element.type && (element.type.match('serial|docuserial|tvshow') ? 'tv' : '') || '',
						vote_average: element.imdb_rating || 0,
						img: element.posters.big,
						year: element.year,
						years: element.years
					});
				});
			}
			return {
				card: card,
				page: page,
				total_pages: total_pages
			};
		};
		this.finds = function (element, find) {
			var finded;
			var filtred = function filtred(items) {
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					if ((element.title_org == (item.original_title || item.original_name) || element.title == (item.title || item.name)) && (item.first_air_date || item.release_date) && parseInt(element.year) == (item.first_air_date || item.release_date).split('-').shift()) {
						finded = item;
						break;
					}
				}
			};
			if (find.movie && find.movie.results.length) filtred(find.movie.results);
			if (find.tv && find.tv.results.length && !finded) filtred(find.tv.results);
			return finded;
		};
		this.start = function () {
			Lampa.Controller.add('content', {
				toggle: function toggle() {
					Lampa.Controller.collectionSet(scroll.render(), info);
					Lampa.Controller.collectionFocus(last || false, scroll.render());
				},
				left: function left() {
					if (Navigator.canmove('left')) Navigator.move('left');
					else Lampa.Controller.toggle('menu');
				},
				right: function right() {
					Navigator.move('right');
				},
				up: function up() {
					if (Navigator.canmove('up')) Navigator.move('up');
					else Lampa.Controller.toggle('head');
				},
				down: function down() {
					if (Navigator.canmove('down')) Navigator.move('down');
				},
				back: function back() {
					Lampa.Activity.backward();
				}
			});
			Lampa.Controller.toggle('content');
		};
		this.pause = function () {};
		this.stop = function () {};
		this.render = function () {
			return html;
		};
		this.destroy = function () {
			network.clear();
			Lampa.Arrays.destroy(items);
			scroll.destroy();
			html.remove();
			body.remove();
			network = null;
			items = null;
			html = null;
			body = null;
			info = null;
		};
	}

	function Radio_n(object) {
		var audio = new Audio();
		var network = new Lampa.Reguest();
		var scroll = new Lampa.Scroll({
			mask: true,
			over: true,
			step: 250
		});
		var items = [];
		var html = $('<div></div>');
		var body = $('<div class="Radio_n category-full"></div>');
		var info;
		var last;
		var song;
		var playing = false;
		this.create = function () {
			var _this = this;
			this.activity.loader(true);
			network.silent(object.url.replace('api.',''), this.build.bind(this), function () {
				var empty = new Lampa.Empty();
				html.append(empty.render());
				_this.start = empty.start;
				_this.activity.loader(false);
				_this.activity.toggle();
			});
			return this.render();
		};
		this.append = function (data) {
			var _this3 = this;
			var name = null;
			var playlist = [];
			data.forEach(function (element) {
				var url_song = element.video;
				var name_song = element.name;
				if (name == null) name = name_song, song = url_song;
				var card = Lampa.Template.get('card', {
					title: name_song,
					release_year: ''
				});
				playlist.push({
					title: name_song,
					url: url_song
				});
				card.addClass('card--category');
				card.find('.card__img').css({
					'cursor': 'pointer',
					'background-color': '#353535a6'
				}).attr('src', element.picture ? element.picture : './img/welcome.jpg');
				card.on('hover:focus', function () {
					last = card[0];
					scroll.update(card, true);
					info.find('.info__title').text(name_song);
					info.find('.info__title-original').text(element.time + (element.quality ? ' / ' + element.quality : ''));
				});
				card.on('hover:enter click.hover', function () {
					$(this).addClass('focus');
					$('.title_plaing').text(name_song);
					card.find('.card--category').addClass('focus');
					if (url_song.indexOf('.m3u8') !== -1) {
						var video = {
							title: name_song,
							url: url_song
						};
						Lampa.Player.play(video);
						Lampa.Player.playlist(playlist);
					} else _this3.Player(url_song);
				});
				body.append(card);
				items.push(card);
			});
			if (info.find('.title_plaing').text() == '') info.find('.title_plaing').text(name);
		};
		this.build = function (data) {
			var _this2 = this;
			Lampa.Background.change(API + 'r/back.jpg');
			but_style += '<style>.Radio_n .card__view {padding-bottom: 65%!important;}.stbut,.stbut *{box-sizing:content-box;letter-spacing:0}.title_plaing{position:absolute;text-align:center;width:150px;margin-top:-5px;font-size:10px}.stbut{transition:.5s linear;border:3px solid #fbfbfb;background-color:#000;border-radius:46px;margin-top:10px;padding:5px 3em 1px 0.5em;font-size:18px;cursor:pointer;height:25.7px;width:110px}.stbut:hover, .stbut.focus{background-color:#edebef;color:#616060;border-color:#8e8e8e}</style>';
			var but_style = '<style>.blink2{-webkit-animation:blink2 1.5s linear infinite;animation:blink2 1.5s linear infinite}@-webkit-keyframes blink2{100%{color:rgba(34,34,34,0)}}@keyframes blink2{100%{color:rgba(34,34,34,0)}}.controll,.controll *{box-sizing:content-box;letter-spacing:0}.controll{transition:.5s linear;border:3px solid #fff;background-color:#fff;border-radius:50%;margin-top:10px;margin-left:-39px;padding:15px;width:40%;height:3%;white-space:nowrap;text-align:center;cursor:pointer}.controll.pause{background-color:#353434;border-color:#3b6531}.controll,.controll .but_left,.controll .but_right,.controll:before{display:inline-block}.controll.pause .but_left,.controll.pause .but_right{margin-left:-6px;margin-top:-7px;border-left:7px solid #fff;border-top:0 solid transparent;border-bottom:0 solid transparent;height:18px}.controll.pause .but_left{border-right:10px solid transparent}.controll.play .but_right{margin-left:-3px;margin-top:-8px;border-left:15px solid #525252;border-top:10px solid transparent;border-bottom:10px solid transparent}.controll:hover,.controll.focus{background-color:#fff}.controll.play.focus{border-color:#8a8a8a}.controll.focus .but_left,.controll.focus .but_right,.controll:hover .but_left,.controll:hover .but_right{border-left-color:#252525}</style>';
			Lampa.Template.add('info_radio', '<div style="height:80px" class="radio_r info layer--width"><div class="info__left"><div style="margin-top:25px" class="info__title"></div><div class="info__create"></div></div><div class="info__right"> <b class="title_plaing"></b>   <div id="stantion_filtr"><div id="stbut" class="stbut selector"><b>СТАНЦИИ</b></div></div>    <div id="player_radio"><div id="plbut" class="controll selector play"><span class="but_left"></span><span class="but_right"></span></div>' + but_style + '</div></div></div>');
			info = Lampa.Template.get('info_radio');
			info.find('#plbut').on('hover:enter hover:click', function () {
				_this2.Player(audio.src ? audio.src : song);
			});
			info.find('#stbut').on('hover:enter hover:click', function () {
				_this2.showStancia();
			});
			scroll.render().addClass('layer--wheight').data('mheight', info);
			html.append(info.append());
			html.append(scroll.render());
			this.append(data);
			scroll.append(body);
			this.activity.loader(false);
			this.activity.toggle();
		};
		this.showStancia = function () {
			var catalogs = [{
				title: 'Radio Record',
				url: API + 'r/record/'
			}, {
				title: 'Ukraine',
				url: API + 'r/ukraine/'
			}, {
			  title: 'Russia',
				url: API + 'r/russia/'
			}, {
				title: 'Rock',
				url: API + 'r/rock/'
			}, {
				title: 'Dance',
				url: API + 'r/dance/'
			}, {
				title: 'Rap',
				url: API + 'r/rap/'
			}, {
				title: 'Background',
				url: API + 'r/fon/'
			}, {
				title: 'Jazz blues',
				url: API + 'r/jazz/'
			}];
			Lampa.Select.show({
				title: Lampa.Lang.translate('radio_style'),
				items: catalogs,
				onBack: function onBack() {
					Lampa.Controller.toggle('content');
				},
				onSelect: function onSelect(a) {
					Lampa.Activity.push({
						url: a.url.replace('api.',''),
						title: a.title,
						component: 'Radio_n',
						page: 1
					});
				}
			});
		};
		this.Player = function (file) {
			if (audio.paused || (audio.src !== file || audio.src == null)) {
				audio.src = file;
				audio.play();
				info.find('.title_plaing').removeClass('blink2');
				info.find('#plbut').removeClass('play').addClass('pause');
			} else {
				audio.pause();
				info.find('.title_plaing').addClass('blink2');
				info.find('#plbut').removeClass('pause').addClass('play');
			}
		};
		this.start = function () {
			var _this = this;
			Lampa.Controller.add('content', {
				toggle: function toggle() {
					Lampa.Controller.collectionSet(scroll.render(), info);
					Lampa.Controller.collectionFocus(last || false, scroll.render());
				},
				left: function left() {
					if (Navigator.canmove('left')) Navigator.move('left');
					else Lampa.Controller.toggle('menu');
				},
				right: function right() {
					if (Navigator.canmove('right')) Navigator.move('right');
					else _this.showStancia();
				},
				up: function up() {
					if (Navigator.canmove('up')) {
						Navigator.move('up');
					} else {
						if (!$('body').find('#stbut').hasClass('focus') && !$('body').find('#plbut').hasClass('focus')) {
							if (!$('body').find('#stbut').hasClass('focus')) {
								Lampa.Controller.collectionSet(info);
								Navigator.move('right');
							}
						} else Lampa.Controller.toggle('head');
					}
				},
				down: function down() {
					if (Navigator.canmove('down')) Navigator.move('down');
					else Lampa.Controller.toggle('content');
				},
				back: function back() {
					Lampa.Activity.backward();
				}
			});
			Lampa.Controller.toggle('content');
		};
		this.pause = function () {
			audio.pause();
		};
		this.stop = function () {};
		this.render = function () {
			return html;
		};
		this.destroy = function () {
			audio.pause();
			network.clear();
			scroll.destroy();
			info.remove();
			html.remove();
			body.remove();
			audio = null;
			network = null;
			items = null;
			html = null;
			body = null;
			info = null;
		};
	}


	function startPlugin() {
		window.plugin_modss = true;
		Lampa.Component.add('forktv', forktv);
		Lampa.Component.add('Radio_n', Radio_n);
				Lampa.Component.add('modss_online', component);
		Lampa.Component.add('collection', collection);
		Lampa.Template.add('onlines_v1', "<div class='online onlines_v1 selector'><div class='online__body'><div style='position: absolute;left: 0;top: -0.3em;width: 2.4em;height: 2.4em'><svg style='height: 2.4em; width:  2.4em;' viewBox='0 0 128 128' fill='none' xmlns='http://www.w3.org/2000/svg'>   <circle cx='64' cy='64' r='56' stroke='white' stroke-width='16'/>   <path d='M90.5 64.3827L50 87.7654L50 41L90.5 64.3827Z' fill='white'/></svg>  </div><div class='online__title' style='padding-left: 2.1em;'>{title}</div><div class='online__quality' style='padding-left: 3.4em;'>{quality}{info}</div> </div></div>");
		Lampa.Template.add('online_folder', "<div class='online selector'> <div class='online__body'><div style='position: absolute;left: 0;top: -0.3em;width: 2.4em;height: 2.4em'>    <svg style='height: 2.4em; width:  2.4em;' viewBox='0 0 128 112' fill='none' xmlns='http://www.w3.org/2000/svg'>   <rect y='20' width='128' height='92' rx='13' fill='white'/>   <path d='M29.9963 8H98.0037C96.0446 3.3021 91.4079 0 86 0H42C36.5921 0 31.9555 3.3021 29.9963 8Z' fill='white' fill-opacity='0.23'/>   <rect x='11' y='8' width='106' height='76' rx='13' fill='white' fill-opacity='0.51'/>    </svg></div><div class='online__title' style='padding-left: 2.1em;'>{title}</div><div class='online__quality' style='padding-left: 3.4em;'>{quality}{info}</div> </div>\n    </div>");
		Lampa.Template.add('onlines_prestige_css', "<style>.online-prestige__episode-number-season{font-size:1em;font-weight:700;color:#fff;position:absolute;top:.5em;right:.5em;background-color: rgba(0, 0, 0, 0.4);padding:0.2em;-webkit-border-radius: 0.3em;moz-border-radius: 0.3em;border-radius: 0.3em;} .online-prestige{position:relative;-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em;background-color:rgba(0,0,0,0.3);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.online-prestige__body{padding:1.2em;line-height:1.3;-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;position:relative}@media screen and (max-width:480px){.online-prestige__body{padding:.8em 1.2em}}.online-prestige__img{position:relative;width:13em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;min-height:8.2em}.online-prestige__img>img{position:absolute;top:0;left:0;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em;opacity:0;-webkit-transition:opacity .3s;-o-transition:opacity .3s;-moz-transition:opacity .3s;transition:opacity .3s}.online-prestige__img--loaded>img{opacity:1}@media screen and (max-width:480px){.online-prestige__img{width:7em;min-height:6em}}.online-prestige__folder{padding:1em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.online-prestige__folder>svg{width:4.4em!important;height:4.4em!important}.online-prestige__viewed{position:absolute;top:1em;left:1em;background:rgba(0,0,0,0.45);-webkit-border-radius:100%;-moz-border-radius:100%;border-radius:100%;padding:.25em;font-size:.76em}.online-prestige__viewed>svg{width:1.5em!important;height:1.5em!important;}.online-prestige__episode-number{position:absolute;top:0;left:0;right:0;bottom:0;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;font-size:2em}.online-prestige__loader{position:absolute;top:50%;left:50%;width:2em;height:2em;margin-left:-1em;margin-top:-1em;background:url(./img/loader.svg) no-repeat center center;-webkit-background-size:contain;-moz-background-size:contain;-o-background-size:contain;background-size:contain}.online-prestige__head,.online-prestige__footer{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige__timeline{margin:.8em 0}.online-prestige__timeline>.time-line{display:block !important}.online-prestige__title{font-size:1.7em;overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}@media screen and (max-width:480px){.online-prestige__title{font-size:1.4em}}.online-prestige__time{padding-left:2em}.online-prestige__info{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige__info>*{overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}.online-prestige__quality{padding-left:1em;white-space:nowrap}.online-prestige__scan-file{position:absolute;bottom:0;left:0;right:0}.online-prestige__scan-file .broadcast__scan{margin:0}.online-prestige .online-prestige-split{font-size:.8em;margin:0 1em;flex-shrink: 0;}.online-prestige.focus::after{content:'';position:absolute;top:-0.6em;left:-0.6em;right:-0.6em;bottom:-0.6em;-webkit-border-radius:.7em;-moz-border-radius:.7em;border-radius:.7em;border:solid .3em #fff;z-index:-1;pointer-events:none}.online-prestige+.online-prestige{margin-top:1.5em}.online-prestige--folder .online-prestige__footer{margin-top:.8em}.online-prestige-rate{display:-webkit-inline-box;display:-webkit-inline-flex;display:-moz-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige-rate>svg{width:1.3em!important;height:1.3em!important;}.online-prestige-rate>span{font-weight:600;font-size:1.1em;padding-left:.7em}.online-empty{line-height:1.4}.online-empty__title{font-size:1.8em;margin-bottom:.3em}.online-empty__time{font-size:1.2em;font-weight:300;margin-bottom:1.6em}.online-empty__buttons{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.online-empty__buttons>*+*{margin-left:1em}.online-empty__button{background:rgba(0,0,0,0.3);font-size:1.2em;padding:.5em 1.2em;-webkit-border-radius:.2em;-moz-border-radius:.2em;border-radius:.2em;margin-bottom:2.4em}.online-empty__button.focus{background:#fff;color:black}.online-empty__templates .online-empty-template:nth-child(2){opacity:.5}.online-empty__templates .online-empty-template:nth-child(3){opacity:.2}.online-empty-template{background-color:rgba(255,255,255,0.3);padding:1em;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em}.online-empty-template>*{background:rgba(0,0,0,0.3);-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em}.online-empty-template__ico{width:4em;height:4em;margin-right:2.4em}.online-empty-template__body{height:1.7em;width:70%}.online-empty-template+.online-empty-template{margin-top:1em}\n        </style>\n    ");
    Lampa.Template.add('online_prestige_full', "<div class=\"online-prestige online-prestige--full selector\">\n            <div class=\"online-prestige__img\">\n                <img alt=\"\">\n                <div class=\"online-prestige__loader\"></div>\n            </div>\n            <div class=\"online-prestige__body\">\n                <div class=\"online-prestige__head\">\n                    <div class=\"online-prestige__title\">{title}</div>\n                    <div class=\"online-prestige__time\">{time}</div>\n                </div>\n\n                <div class=\"online-prestige__timeline\"></div>\n\n                <div class=\"online-prestige__footer\">\n                    <div class=\"online-prestige__info\">{info}</div>\n                    <div class=\"online-prestige__quality\">{quality}</div>\n                </div>\n            </div>\n        </div>");
    Lampa.Template.add('onlines_does_not_answer', "<div class=\"online-empty\">\n            <div class=\"online-empty__title\">\n                {title}\n            </div>\n            <div class=\"online-empty__time\">\n                #{online_balanser_timeout}\n            </div>\n            <div class=\"online-empty__buttons\">\n                <div class=\"online-empty__button selector cancel\">#{cancel}</div>\n                <div class=\"online-empty__button selector change\">#{online_change_balanser}</div>\n            </div>\n            <div class=\"online-empty__templates\">\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n            </div>\n        </div>");
    Lampa.Template.add('online_prestige_rate', "<div class=\"online-prestige-rate\">\n            <svg width=\"17\" height=\"16\" viewBox=\"0 0 17 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                <path d=\"M8.39409 0.192139L10.99 5.30994L16.7882 6.20387L12.5475 10.4277L13.5819 15.9311L8.39409 13.2425L3.20626 15.9311L4.24065 10.4277L0 6.20387L5.79819 5.30994L8.39409 0.192139Z\" fill=\"#fff\"></path>\n            </svg>\n            <span>{rate}</span>\n        </div>");
    Lampa.Template.add('online_prestige_folder', "<div class=\"online-prestige online-prestige--folder selector\">\n            <div class=\"online-prestige__folder\">\n                <svg viewBox=\"0 0 128 112\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <rect y=\"20\" width=\"128\" height=\"92\" rx=\"13\" fill=\"white\"></rect>\n                    <path d=\"M29.9963 8H98.0037C96.0446 3.3021 91.4079 0 86 0H42C36.5921 0 31.9555 3.3021 29.9963 8Z\" fill=\"white\" fill-opacity=\"0.23\"></path>\n                    <rect x=\"11\" y=\"8\" width=\"106\" height=\"76\" rx=\"13\" fill=\"white\" fill-opacity=\"0.51\"></rect>\n                </svg>\n            </div>\n            <div class=\"online-prestige__body\">\n                <div class=\"online-prestige__head\">\n                    <div class=\"online-prestige__title\">{title}</div>\n                    <div class=\"online-prestige__time\">{time}</div>\n                </div>\n\n                <div class=\"online-prestige__footer\">\n                    <div class=\"online-prestige__info\">{info}</div>\n                </div>\n            </div>\n        </div>");
		Lampa.Template.add('modss_style', "<style>@media screen and (max-width: 585px) {.timeline{bottom:12em}.card--new_seria {right:2em!important;bottom:10em!important} .card--last_view{right:80%!important;top:2em!important}}</style>");
		Lampa.Template.add('hdgo_item', '<div class="selector hdgo-item"><div class="hdgo-item__imgbox"><img class="hdgo-item__img"/><div class="card__icons"><div class="card__icons-inner"></div></div></div><div class="hdgo-item__name">{title}</div></div>');
		Lampa.Template.add('hdgo_style', '<style>.last--focus .hdgo-item__imgbox::after {content: "";position: absolute;top: -0.4em;left: -0.4em;right: -0.4em;bottom: -0.4em;border: .3em solid red;-webkit-border-radius: .8em;-moz-border-radius: .8em;border-radius: .8em;opacity: .4}.iptv-channel__name {padding:20px;text-align: center;font-size: 1.2em}.modss__tv.focus .hdgo-item__imgbox::after {opacity: 1}.nuamtv {filter: blur(7px);}.nuamtv:hover, .nuamtv:action {filter: blur(0px);}.a-r.b{color:#fff;background: linear-gradient(to right, rgba(204,0,0,1) 0%,rgba(150,0,0,1) 100%);}.a-r.de{color:#fff;background: linear-gradient(to right, #ffbc54 0%,#ff5b55 100%);}.a-r.g{background: linear-gradient(to right, rgba(205,235,142,1) 0%,rgba(165,201,86,1) 100%);color: #12420D;}.card.home.focus .card__img {border-color: green!important;-webkit-box-shadow: 0 0 0 0.4em green!important;-moz-box-shadow: 0 0 0 0.4em green!important;box-shadow: 0 0 0 0.4em green!important;}@media screen and (max-width: 2560px) {.pc.hdgo.card--collection,.pc.card--collection{width:11em!important} .tv_tv{width:12.5%!important}.tv_tv_c{width:20%!important}.tv_pc{width:16.66%!important}.tv.hdgo.card--collection{width:10.3em!important} .tv.card--collection{width:14.2%!important}.tv.sort.card--collection{width:25%!important}.tv.sort.hdgo.card--collection{width:25%!important}  .sort.hdgo.card--collection .card__view {padding-bottom:25%!important} .tv.two.sort.card--collection .card__view {padding-bottom: 10%!important} .tv.two.sort.card--collection{height:20%!important;width:50%!important}.pc.card--category, .tv.card--category{width:14.28%}.nuam.card--collection{width:20%!important}}  @media screen and (max-width: 1380px) {.pc.card--collection,.mobile,.mobile_tv{width:16.6%!important} .tv_pc{width:14.28%!important} .tv_pc_c{width:25%!important} .tv_tv{width:14.28%!important} .pc.hdgo.card--collection,.hdgo.card--collection{width:10em!important}.sort.pc.card--collection{width:25%!important}.sort.hdgo.card--collection{width:25%!important} .sort.hdgo.card--collection .card__view {padding-bottom:40%!important} .two.sort.card--collection{width:50%!important} .pc.two.sort.card--collection .card__view {padding-bottom: 33%!important} .pc.card--category,.nuam.card--category{width:11.5em!important}}  @media screen and (max-width: 420px) {.pc.card--collection,.mobile{width:10.8em!important}.mobile_tv{width:33.3%!important}  .pc.hdgo.card--collection,.hdgo.card--collection{width:10em!important}.pc.card--category,.nuam.card--category{width:8.1em!important}.nuam.card--collection{width:33.3%!important}.sort.hdgo.card--collection .card__view {padding-bottom:60%!important}}   .searc.card--collection .card__view {padding-bottom: 5%!important}.searc.card--collection{width:100%!important}.searc.card--collection .card__img{height:100%!important;}.hdgo-item{margin:0 .3em;width:10.4em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.hdgo-item__imgbox{background-color:#3e3e3e;padding-bottom:60%;position:relative;-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em}.hdgo-item__img{position:absolute;top:0;left:0;width:100%;height:100%}.hdgo-item__name{font-size:1.1em;margin-top:.8em}.hdgo-item.focus .hdgo-item__imgbox:after{border:solid .4em #fff;content:"";display:block;position:absolute;left:0;top:0;right:0;bottom:0;-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em}.hdgo-item +.hdgo-item{margin:0 .3em}.modss_tv .items-line + .items-line, .forktv .items-line + .items-line {margin-top:0!important;}</style>');
		Lampa.Template.add('iptv_details', '<div class="iptv-details"><div class="epg_load" style="display:none;margin-bottom:-2em;position:relative"><div class="broadcast__text">' + Lampa.Lang.translate('search_searching') + '</div><div class="broadcast__scan"><div></div></div></div><div class="iptv__program"></div></div>');
    
		if (!Lampa.Lang) {
			var lang_data = {};
			Lampa.Lang = {
				add: function (data) {
					lang_data = data;
				},
				translate: function (key) {
					return lang_data[key] ? lang_data[key].ru : key;
				}
			}
		}
		Lampa.Lang.add({
			pub_sort_views: {
				ru: 'По просмотрам',
				uk: 'По переглядах',
				en: 'By views'
			},
			pub_sort_watchers: {
				ru: 'По подпискам',
				uk: 'За підписками',
				en: 'Subscriptions'
			},
			pub_sort_updated: {
				ru: 'По обновлению',
				uk: 'За оновленням',
				en: 'By update'
			},
			pub_sort_created: {
				ru: 'По дате добавления',
				uk: 'За датою додавання',
				en: 'By date added'
			},
			pub_search_coll: {
				ru: 'Поиск по подборкам',
				uk: 'Пошук по добіркам',
				en: 'Search by collections'
			},
			pub_title_all: {
				ru: 'Все',
				uk: 'Все',
				en: 'All'
			},
			pub_title_popular: {
				ru: 'Популярные',
				uk: 'Популярнi',
				en: 'Popular'
			},
			pub_title_new: {
				ru: 'Новые',
				uk: 'Новi',
				en: 'New'
			},
			pub_title_hot: {
				ru: 'Горячие',
				uk: 'Гарячi',
				en: 'Hot'
			},
			pub_title_rating: {
				ru: 'Рейтинговые',
				uk: 'Рейтинговi',
				en: 'Rating'
			},
			pub_title_allingenre: {
				ru: 'Всё в жанре',
				uk: 'Все у жанрі',
				en: 'All in the genre'
			},
			pub_title_popularfilm: {
				ru: 'Популярные фильмы',
				uk: 'Популярні фільми',
				en: 'Popular movies'
			},
			pub_title_popularserial: {
				ru: 'Популярные сериалы',
				uk: 'Популярні сериали',
				en: 'Popular series'
			},
			pub_title_newfilm: {
				ru: 'Новые фильмы',
				uk: 'Новi фiльми',
				en: 'New movies'
			},
			pub_title_newserial: {
				ru: 'Новые сериалы',
				uk: 'Новi серiали',
				en: 'New series'
			},
			pub_title_newconcert: {
				ru: 'Новые концерты',
				uk: 'Новi концерти',
				en: 'New concerts'
			},
			pub_title_newdocfilm: {
				ru: 'Новые док. фильмы',
				uk: 'Новi док. фiльми',
				en: 'New document movies'
			},
			pub_title_newdocserial: {
				ru: 'Новые док. сериалы',
				uk: 'Новi док. серiали',
				en: 'New document series'
			},
			pub_title_newtvshow: {
				ru: 'Новое ТВ шоу',
				uk: 'Нове ТБ шоу',
				en: 'New TV show'
			},
			pub_modal_title: {
				ru: '1. Авторизируйтесь на сайте: <a style="color:#fff" href="#">https://kino.pub/device</a><br>2. В поле "Активация устройства" введите код.',
				uk: '1. Авторизуйтесь на сайті: <a style="color:#fff" href="#">https://kino.pub/device</a><br>2.  Введіть код у полі "Активація пристрою".',
				en: '1. Log in to the site: <a style="color:#fff" href="#">https://kino.pub/device</a><br>2.  Enter the code in the "Device activation" field.'
			},
			pub_title_wait: {
				ru: 'Ожидание идентификации кода',
				uk: 'Очікування ідентифікації коду',
				en: 'Waiting for code identification'
			},
			pub_title_left_days: {
				ru: 'Осталось: ',
				uk: 'Залишилось: ',
				en: 'Left days: '
			},
			pub_title_left_days_d: {
				ru: 'дн.',
				uk: 'дн.',
				en: 'd.'
			},
			pub_title_regdate: {
				ru: 'Дата регистрации:',
				uk: 'Дата реєстрації:',
				en: 'Date of registration:'
			},
			pub_date_end_pro: {
				ru: 'ПРО заканчивается:',
				uk: 'ПРО закінчується:',
				en: 'PRO ends:'
			},
			pub_auth_add_descr: {
				ru: 'Добавить в свой профиль устройство',
				uk: 'Додати у свій профіль пристрій',
				en: 'Add a device to your profile'
			},
			pub_title_not_pro: {
				ru: 'ПРО не активирован',
				uk: 'ПРО не активований',
				en: 'PRO is not activated'
			},
			pub_device_dell_noty: {
				ru: 'Устройство успешно удалено',
				uk: 'Пристрій успішно видалено',
				en: 'Device deleted successfully'
			},
			pub_device_title_options: {
				ru: 'Настройки устройства',
				uk: 'Налаштування пристрою',
				en: 'Device Settings'
			},
			pub_device_options_edited: {
				ru: 'Настройки устройства изменены',
				uk: 'Установки пристрою змінено',
				en: 'Device settings changed'
			},
			saved_collections_clears: {
				ru: 'Сохранённые подборки очищены',
				uk: 'Збірки очищені',
				en: 'Saved collections cleared'
			},
			card_my_clear: {
				ru: 'Убрать с моих подборок',
				uk: 'Прибрати з моїх добірок',
				en: 'Remove from my collections'
			},
			card_my_add: {
				ru: 'Добавить в мои подборки',
				uk: 'Додати до моїх добірок',
				en: 'Add to my collections'
			},
			card_my_descr: {
				ru: 'Смотрите в меню (Подборки)',
				uk: 'Дивитесь в меню (Підбірки)',
				en: 'Look in the menu (Collections)'
			},
			card_my_clear_all: {
				ru: 'Удалить всё',
				uk: 'Видалити все',
				en: 'Delete all'
			},
			card_my_clear_all_descr: {
				ru: 'Очистит все сохранённые подборки',
				uk: 'Очистити всі збережені збірки',
				en: 'Clear all saved selections'
			},
			radio_style: {
				ru: 'Стиль',
				uk: 'Стиль',
				en: 'Style'
			},
			title_on_the: {
				ru: 'на',
				uk: 'на',
				en: 'on'
			},
			title_my_collections: {
				ru: 'Мои подборки',
				uk: 'Мої добiрки',
				en: 'My collections'
			},
			online_nolink: {
				ru: 'Не удалось извлечь ссылку',
				uk: 'Неможливо отримати посилання',
				en: 'Failed to fetch link'
			},
			title_online_continue: {
				ru: 'Продолжить',
				uk: 'Продовжити',
				en: 'Continue'
			},
			online_viewed: {
				ru: 'Просмотрено',
				uk: 'Переглянуто',
				en: 'Viewed'
			},
			online_balanser: {
				ru: 'Балансер',
				uk: 'Балансер',
				en: 'Balancer'
			},
			helper_online_file: {
				ru: 'Удерживайте клавишу "ОК" для вызова контекстного меню',
				uk: 'Утримуйте клавішу "ОК" для виклику контекстного меню',
				en: 'Hold the "OK" key to bring up the context menu'
			},
			online_query_start: {
				ru: 'По запросу',
				uk: 'На запит',
				en: 'On request'
			},
			online_query_end: {
				ru: 'нет результатов',
				uk: 'немає результатів',
				en: 'no results'
			},
			filter_series_order: {
				ru: 'Порядок серий',
				uk: 'Порядок серій',
				en: 'Series order'
			},
			filter_video_stream: {
				ru: 'Видео поток',
				uk: 'Відео потік',
				en: 'Video stream'
			},
			filter_video_codec: {
				ru: 'Кодек',
				uk: 'Кодек',
				en: 'Codec'
			},
			title_online: {
				ru: 'Онлайн',
				uk: 'Онлайн',
				en: 'Online'
			},
			title_online_continued: {
				ru: 'Продолжить просмотр',
				uk: 'Продовжити перегляд',
				en: 'Continue browsing'
			},
			title_online_descr: {
				ru: 'Позволяет запускать плеер сразу на том месте, где остановили просмотр. Работает только в ВСТРОЕННОМ плеере.',
				uk: 'Дозволяє запускати плеєр одразу на тому місці, де зупинили перегляд.  Працює тільки у Вбудованому плеєрі.',
				en: 'Allows you to start the player immediately at the place where you stopped browsing.  Works only in the INTEGRATED player.'
			},
			online_waitlink: {
				ru: 'Работаем над извлечением ссылки, подождите...',
				uk: 'Працюємо над отриманням посилання, зачекайте...',
				en: 'Working on extracting the link, please wait...'
			},
			online_change_balanser: {
        ru: 'Изменить балансер',
        uk: 'Змінити балансер',
        en: 'Change balancer',
        zh: '更改平衡器'
      },
      online_clear_all_marks: {
        ru: 'Очистить все метки',
        uk: 'Очистити всі мітки',
        en: 'Clear all labels',
        zh: '清除所有标签'
      },
      online_clear_all_timecodes: {
        ru: 'Очистить все тайм-коды',
        uk: 'Очистити всі тайм-коди',
        en: 'Clear all timecodes',
        zh: '清除所有时间代码'
      },
		  online_balanser_dont_work: {
        ru: 'Балансер ({balanser}) не отвечает на запрос.',
        uk: 'Балансер ({balanser}) не відповідає на запит.',
        en: 'Balancer ({balanser}) does not respond to the request.',
        zh: '平衡器（{balanser}）未响应请求。'
      },
      online_balanser_timeout: {
        ru: 'Балансер будет переключен автоматически через <span class="timeout">10</span> секунд.',
        uk: 'Балансер буде переключено автоматично через <span class="timeout">10</span> секунд.',
        en: 'Balancer will be switched automatically in <span class="timeout">10</span> seconds.',
        zh: '平衡器将在<span class="timeout">10</span>秒内自动切换。'
      },
      online_balanser_dont_work_from: {
        ru: ' на балансере <b>{balanser}</b>',
        uk: ' на балансері <b>{balanser}</b>',
        en: ' на балансере <b>{balanser}</b>',
      },
			online_dash: {
        ru: 'Предпочитать DASH вместо HLS',
        uk: 'Віддавати перевагу DASH замість HLS',
        be: 'Аддаваць перавагу DASH замест HLS',
        en: 'Prefer DASH over HLS',
        zh: '比 HLS 更喜欢 DASH'
      },
			online_title_clear_all_mark: {
				ru: 'Снять отметку у всех',
				uk: 'Зняти відмітку у всіх',
				en: 'Unmark all'
			},
			online_title_clear_all_timecode: {
				ru: 'Сбросить тайм-код у всех',
				uk: 'Скинути тайм-код у всіх',
				en: 'Reset timecode for all'
			},
			online_title_links: {
				ru: 'Качество',
				uk: 'Якість',
				en: 'Quality'
			},
			title_prioriry_balanser: {
        ru: 'Балансер по умолчанию',
        uk: 'Балансер за замовчуванням',
        en: 'Default balancer',
      },
      title_prioriry_balanser_descr: {
        ru: 'Балансер фильмов по умолчанию',
        uk: 'Джерело фільмів за замовчуванням',
        en: 'Default movie source',
      },
			title_proxy: {
				ru: 'Прокси',
				uk: 'Проксі',
				en: 'Proxy'
			},
			online_proxy_title: {
				ru: 'Личный прокси',
				uk: 'Особистий проксі',
				en: 'Your proxy'
			},
			online_proxy_title_descr: {
				ru: 'Если балансер недоступен или не отвечает, требуется в выбранном Вами балансере "Включить" прокси, или указать ссылку на "Свой URL"',
				uk: 'Якщо балансер недоступний або не відповідає, потрібно у вибраному Вами балансері "Увімкнути" проксі, або вказати посилання на "Свій URL"',
				en: 'If the balancer is not available or does not respond, you need to "Enable" the proxy in the balancer you have chosen, or specify a link to "Custom URL"'
			},
			online_proxy_title_main: {
				ru: 'Встроенный прокси',
				uk: 'Вбудований проксі',
				en: 'Built-in proxy'
			},
			online_proxy_title_main_descr: {
				ru: 'Позволяет использовать встроенный в систему прокси для всех балансеров',
				uk: 'Дозволяє використовувати вбудований у систему проксі для всіх балансерів',
				en: 'Allows you to use the built-in proxy for all balancers'
			},
			online_proxy_descr: {
				ru: 'Позволяет задать личный прокси для всех балансеров',
				uk: 'Дозволяє встановити особистий проксі для всіх балансерів',
				en: 'Allows you to set a personal proxy for all balancers'
			},
			online_proxy_placeholder: {
				ru: 'Например: http://proxy.com',
				uk: 'Наприклад: http://proxy.com',
				en: 'For example: http://proxy.com'
			},
			online_proxy_url: {
				ru: 'Свой URL',
				uk: 'Свiй URL',
				en: 'Mine URL'
			},
			online_voice_subscribe: {
				ru: 'Подписаться на перевод',
				uk: 'Підписатися на переклад',
				en: 'Subscribe to translation'
			},
			online_voice_success: {
				ru: 'Вы успешно подписались',
				uk: 'Ви успішно підписалися',
				en: 'You have successfully subscribed'
			},
			online_voice_error: {
				ru: 'Возникла ошибка',
				uk: 'Виникла помилка',
				en: 'An error has occurred'
			},
			filmix_param_add_title: {
				ru: 'Добавить ТОКЕН от Filmix',
				uk: 'Додати ТОКЕН від Filmix',
				en: 'Add TOKEN from Filmix'
			},
			filmix_param_add_descr: {
				ru: 'Добавьте ТОКЕН для подключения подписки',
				uk: 'Додайте ТОКЕН для підключення передплати',
				en: 'Add a TOKEN to connect a subscription'
			},
			filmix_param_placeholder: {
				ru: 'Например: nxjekeb57385b..',
				uk: 'Наприклад: nxjekeb57385b..',
				en: 'For example: nxjekeb57385b..'
			},
			filmix_params_add_device: {
				ru: 'Добавить устройство на ',
				uk: 'Додати пристрій на ',
				en: 'Add Device to '
			},
			filmix_modal_text: {
				ru: 'Введите его на странице https://filmix.ac/consoles в вашем авторизованном аккаунте!',
				uk: 'Введіть його на сторінці https://filmix.ac/consoles у вашому авторизованому обліковому записі!',
				en: 'Enter it at https://filmix.ac/consoles in your authorized account!'
			},
			filmix_modal_wait: {
				ru: 'Ожидаем код',
				uk: 'Очікуємо код',
				en: 'Waiting for the code'
			},
			filmix_copy_secuses: {
				ru: 'Код скопирован в буфер обмена',
				uk: 'Код скопійовано в буфер обміну',
				en: 'Code copied to clipboard'
			},
			filmix_copy_fail: {
				ru: 'Ошибка при копировании',
				uk: 'Помилка при копіюванні',
				en: 'Copy error'
			},
			filmix_nodevice: {
				ru: 'Устройство не авторизовано',
				uk: 'Пристрій не авторизований',
				en: 'Device not authorized'
			},
			fork_auth_modal_title: {
				ru: '1. Авторизируйтесь на: <a style="color:#fff" href="#">http://forktv.me</a><br>2. Потребуется оформить подписку<br>3. В поле "Ваш ID/MAC" добавьте код',
				uk: '1. Авторизуйтесь на: <a style="color:#fff" href="#">http://forktv.me</a><br>2. Потрібно оформити передплату<br>3. У полі "Ваш ID/MAC" додайте код',
				en: '1. Log in to: <a style="color:#fff" href="#">http://forktv.me</a><br>2. Subscription required<br>3. In the "Your ID / MAC" field, add the code'
			},
			fork_modal_wait: {
				ru: '<b style="font-size:1em">Ожидание идентификации кода</b><hr>После завершения идентификации произойдет перенаправление в обновленный раздел ForkTV',
				uk: '<b style="font-size:1em">Очiкуемо ідентифікації коду</b><hr>Після завершення ідентифікації відбудеться перенаправлення в оновлений розділ ForkTV',
				en: '<b style="font-size:1em">Waiting for code identification</b><hr>After identification is completed, you will be redirected to the updated ForkTV section'
			},
			title_status: {
				ru: 'Статус',
				uk: 'Статус',
				en: 'Status'
			},
			season_ended: {
				ru: 'сезон завершён',
				uk: 'сезон завершено',
				en: 'season ended'
			},
			season_from: {
				ru: 'из',
				uk: 'з',
				en: 'from'
			},
			season_new: {
				ru: 'Новая',
				uk: 'Нова',
				en: 'New'
			},
			info_attention: {
				ru: 'Внимание',
				uk: 'Увага',
				en: 'Attention'
			},
			info_pub_descr: {
				ru: '<b>KinoPub</b> платный ресурс, просмотр онлайн с балансера, а так же спортивные ТВ каналы будут доступны после покупки <b>PRO</b> в аккаунте на сайте',
				uk: '<b>KinoPub</b> платний ресурс, перегляд онлайн з балансера, а також спортивні ТБ канали будуть доступні після покупки <b>PRO</b> в обліковому записі на сайті',
				en: '<b>KinoPub</b> a paid resource, online viewing from a balancer, as well as sports TV channels will be available after purchasing <b>PRO</b> in your account on the site'
			},
			info_filmix_descr: {
				ru: 'Максимально доступное качество для просмотра без подписки - 720p. Для того, чтобы смотреть фильмы и сериалы в качестве - 1080р-2160р требуется подписка <b>PRO</b> или <b>PRO-PLUS</b> на сайте',
				uk: 'Максимально доступна якість для перегляду без підписки – 720p.  Для того, щоб дивитися фільми та серіали як - 1080р-2160р потрібна підписка <b>PRO</b> або <b>PRO-PLUS</b> на сайтi',
				en: 'The maximum available quality for viewing without a subscription is 720p.  In order to watch movies and series in quality - 1080p-2160p, you need a <b>PRO</b> or <b>PRO-PLUS</b> subscription to the site'
			},
			params_pub_on: {
				ru: 'Включить',
				uk: 'Увiмкнути',
				en: 'Enable'
			},
			params_pub_off: {
				ru: 'Выключить',
				uk: 'Вимкнути',
				en: 'Disable'
			},
			params_pub_on_descr: {
				ru: 'Отображает источник "<b>KinoPub</b>", а так же подборки. Для просмотра с балансера, а так же ТВ спорт каналов <span style="color:#ffd402">требуется подписка<span>',
				uk: 'Відображає джерело "<b>KinoPub</b>", а також добірки.  Для перегляду з балансера, а також ТБ спорт каналів <span style="color:#ffd402">потрібна підписка<span>',
				en: 'Displays the "<b>KinoPub</b>" source as well as collections.  To view from the balancer, as well as TV sports channels <span style="color:#ffd402">subscription<span> is required'
			},
			params_pub_add_source: {
				ru: 'Установить источник',
				uk: 'Встановити джерело',
				en: 'Set source'
			},
			pub_source_add_noty: {
				ru: 'KinoPub установлен источником по умолчанию',
				uk: 'KinoPub встановлений стандартним джерелом',
				en: 'KinoPub set as default source'
			},
			descr_pub_settings: {
				ru: 'Настройки сервера, типа потока...',
				uk: 'Налаштування сервера типу потоку...',
				en: 'Server settings, stream type...'
			},
			params_pub_add_source_descr: {
				ru: 'Установить источник по умолчанию на KinoPub',
				uk: 'Встановити стандартне джерело на KinoPub',
				en: 'Set Default Source to KinoPub'
			},
			params_pub_update_tocken: {
				ru: 'Обновить токен',
				uk: 'Оновити токен',
				en: 'Update token'
			},
			params_pub_dell_device: {
				ru: 'Удалить привязку устройства',
				uk: 'Видалити прив\'язку пристрою',
				en: 'Remove device link'
			},
			params_pub_dell_descr: {
				ru: 'Будет удалено устройство с прывязаных устройств в аккаунте',
				uk: 'Буде видалено пристрій із прив\'язаних пристроїв в обліковому записі',
				en: 'The device will be removed from linked devices in the account'
			},
			params_radio_enable: {
				ru: 'Включить радио',
				uk: 'Увiмкнути радiо',
				en: 'Enable radio'
			},
			params_radio_enable_descr: {
				ru: 'Отображает пункт "Радио" в главном меню с популярными радио-станциями',
				uk: 'Відображає пункт "Радіо" в головному меню з популярними радіостанціями',
				en: 'Displays the item "Radio" in the main menu with popular radio stations'
			},
			params_tv_enable: {
				ru: 'Включить ТВ',
				uk: 'Увiмкнути ТВ',
				en: 'Enable TV'
			},
			params_tv_enable_descr: {
				ru: 'Отображает пункт "Modss-TV" в главном меню с популярными каналами',
				uk: 'Відображає пункт "Modss-TV" в головному меню з популярними каналами',
				en: 'Displays the item "Modss-TV" in the main menu with popular channels'
			},
			params_collections_descr: {
				ru: 'Добавляет в пункт "Подборки" популярные разделы, такие как Rezka, Filmix, KinoPub',
				uk: 'Додає до пункту "Підбірки" популярні розділи, такі як Rezka, Filmix, KinoPub',
				en: 'Adds to "Collections" popular sections such as Rezka, Filmix, KinoPub'
			},
			params_styles_title: {
				ru: 'Стилизация',
				uk: 'Стилізація',
				en: 'Stylization'
			},
			placeholder_password: {
				ru: 'Введите пароль',
				uk: 'Введіть пароль',
				en: 'Enter password'
			},
			title_parent_contr: {
				ru: 'Родительский контроль',
				uk: 'Батьківський контроль',
				en: 'Parental control'
			},
			title_addons: {
				ru: 'Дополнения',
				uk: 'Додатки',
				en: 'Add-ons'
			},
			onl_enable_descr: {
				ru: 'Позволяет просматривать фильмы, сериалы в режиме Stream',
				uk: 'Дозволяє переглядати фільми, серіали в режимі Stream',
				en: 'Allows you to watch movies, series in Stream mode'
			},
			fork_enable_descr: {
				ru: 'Отображает пункт <b>"ForkTV"</b> в главном меню с популярными источниками, торрентами',
				uk: 'Відображає пункт <b>"ForkTV"</b> у головному меню з популярними джерелами, торрентами',
				en: 'Displays <b>"ForkTV"</b> item in main menu with popular sources, torrents'
			},
			title_fork_edit_cats: {
				ru: 'Изменить разделы',
				uk: 'Змінити розділи',
				en: 'Edit Sections'
			},
			title_fork_add_cats: {
				ru: 'Добавить разделы',
				uk: 'Додати розділи',
				en: 'Add Sections'
			},
			title_fork_clear: {
				ru: 'Очистить разделы',
				uk: 'Очистити розділи',
				en: 'Clear Sections'
			},
			title_fork_clear_descr: {
				ru: 'Будет выполнена очистка всех выбранных разделов',
				uk: 'Буде виконано очищення всіх вибраних розділів',
				en: 'All selected partitions will be cleared'
			},
			title_fork_clear_noty: {
				ru: 'Разделы успешно очищены',
				uk: 'Розділи успішно очищені',
				en: 'Partitions cleared successfully'
			},
			title_fork_reload_code: {
				ru: 'Обновить код',
				uk: 'Оновити код',
				en: 'Update Code'
			},
			title_fork_current: {
				ru: 'Текущий',
				uk: 'Поточний',
				en: 'Current'
			},
			title_fork_new: {
				ru: 'Новый',
				uk: 'Новий',
				en: 'New'
			},
			title_tv_clear_fav: {
				ru: 'Очистить избранное',
				uk: 'Очистити вибране',
				en: 'Clear Favorites'
			},
			title_tv_clear__fav_descr: {
				ru: 'Будет выполнена очистка избранных каналов',
				uk: 'Буде виконано очищення обраних каналів',
				en: 'Favorite channels will be cleared'
			},
			title_tv_clear_fav_noty: {
				ru: 'Все избранные каналы удалены',
				uk: 'Усі вибрані канали видалені',
				en: 'All favorite channels have been deleted'
			},
			succes_update_noty: {
				ru: 'успешно обновлён',
				uk: 'успішно оновлено',
				en: 'successfully updated'
			},
			title_enable_rating: {
				ru: 'Включить рейтинг',
				uk: 'Увiмкнути рейтинг',
				en: 'Enable rating'
			},
			title_enable_rating_descr: {
				ru: 'Отображает в карточке рейтинг Кинопоиск и IMDB',
				uk: 'Відображає у картці рейтинг Кінопошук та IMDB',
				en: 'Displays the Kinopoisk and IMDB rating in the card'
			},
			title_info_serial: {
				ru: 'Информация о карточке',
				uk: 'Інформація про картку',
				en: 'Card Information'
			},
			title_info_serial_descr: {
				ru: 'Отображает информацию о количестве серий в карточке, в том числе последнею серию на постере',
				uk: 'Відображає інформацію про кількість серій у картці, у тому числі останню серію на постері',
				en: 'Displays information about the number of episodes in the card, including the last episode on the poster'
			},
			title_add_butback: {
				ru: 'Включить кнопку "Назад"',
				uk: 'Увiмкнути кнопку "Назад"',
				en: 'Enable back button'
			},
			title_add_butback_descr: {
				ru: 'Отображает внешнюю кнопку "Назад" для удобной навигации в полноэкраном режиме на различных смартфона',
				uk: 'Відображає зовнішню кнопку "Назад" для зручної навігації в повноекранному режимі на різних смартфонах',
				en: 'Displays an external back button for easy full-screen navigation on various smartphones'
			},
			title_butback_pos: {
				ru: 'Положение кнопки "Назад"',
				uk: 'Розташування кнопки "Назад"',
				en: 'Back button position'
			},
			buttback_right: {
				ru: 'Справа',
				uk: 'Праворуч',
				en: 'Right'
			},
			buttback_left: {
				ru: 'Слева',
				uk: 'Лiворуч',
				en: 'Left'
			},
			title_close_app: {
				ru: 'Закрыть приложение',
				uk: 'Закрити додаток',
				en: 'Close application'
			},
			title_radio: {
				ru: 'Радио',
				uk: 'Радiо',
				en: 'Radio'
			}
		});
		Lampa.Listener.follow('full', function (e) {
			if (e.type == 'complite') {
				cards = e.data.movie;
				//Serial info, last view seria
				Modss.serialInfo(e.data.movie);
				//Rating and QUALITY
				if (e.data.recomend && e.data.recomend.results.length > 0) {
					var elem = e.data.recomend.results.concat(e.data.movie);
					Lampa.VideoQuality.add(elem);
				}
				Modss.rating_kp_imdb(e.data.movie);
				//Button online
				Modss.online(e.data.movie);
				//Style buttons
				$('.view--torrent').addClass('selector').empty().append('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 48 48" width="48px" height="48px"><path d="M 23.501953 4.125 C 12.485953 4.125 3.5019531 13.11 3.5019531 24.125 C 3.5019531 32.932677 9.2467538 40.435277 17.179688 43.091797 L 17.146484 42.996094 L 7 16 L 15 14 C 17.573 20.519 20.825516 32.721688 27.728516 30.929688 C 35.781516 28.948688 28.615 16.981172 27 12.076172 L 34 11 C 38.025862 19.563024 39.693648 25.901226 43.175781 27.089844 C 43.191423 27.095188 43.235077 27.103922 43.275391 27.113281 C 43.422576 26.137952 43.501953 25.140294 43.501953 24.125 C 43.501953 13.11 34.517953 4.125 23.501953 4.125 z M 34.904297 29.314453 C 34.250297 34.648453 28.811359 37.069578 21.943359 35.517578 L 26.316406 43.763672 L 26.392578 43.914062 C 33.176993 42.923925 38.872645 38.505764 41.660156 32.484375 C 41.603665 32.485465 41.546284 32.486418 41.529297 32.486328 C 38.928405 32.472567 36.607552 31.572967 34.904297 29.314453 z"/></svg><span>' + Lampa.Lang.translate('full_torrents') + '</span>');
				$('.view--trailer').empty().append("<svg enable-background='new 0 0 512 512' id='Layer_1' version='1.1' viewBox='0 0 512 512' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g><path fill='currentColor' d='M260.4,449c-57.1-1.8-111.4-3.2-165.7-5.3c-11.7-0.5-23.6-2.3-35-5c-21.4-5-36.2-17.9-43.8-39c-6.1-17-8.3-34.5-9.9-52.3   C2.5,305.6,2.5,263.8,4.2,222c1-23.6,1.6-47.4,7.9-70.3c3.8-13.7,8.4-27.1,19.5-37c11.7-10.5,25.4-16.8,41-17.5   c42.8-2.1,85.5-4.7,128.3-5.1c57.6-0.6,115.3,0.2,172.9,1.3c24.9,0.5,50,1.8,74.7,5c22.6,3,39.5,15.6,48.5,37.6   c6.9,16.9,9.5,34.6,11,52.6c3.9,45.1,4,90.2,1.8,135.3c-1.1,22.9-2.2,45.9-8.7,68.2c-7.4,25.6-23.1,42.5-49.3,48.3   c-10.2,2.2-20.8,3-31.2,3.4C366.2,445.7,311.9,447.4,260.4,449z M205.1,335.3c45.6-23.6,90.7-47,136.7-70.9   c-45.9-24-91-47.5-136.7-71.4C205.1,240.7,205.1,287.6,205.1,335.3z'/></g></svg><span>" + Lampa.Lang.translate('full_trailers') + "</span>");
				$('.open--menu').empty().append("<svg height='48' viewBox='0 0 48 48' width='48' xmlns='http://www.w3.org/2000/svg'><path d='M0 0h48v48H0z' fill='none'/><path fill='currentColor' d='M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm-4 29V15l12 9-12 9z'/></svg><span>" + Lampa.Lang.translate('title_watch') + "</span>");
			}
		});
		Lampa.Listener.follow('activity', function (e) {
			if(e.type == 'archive' && e.component == 'full') {
		  } 
			if (e.component == 'modss_online' && e.type == 'destroy') {
		  	Modss.online(e.object.movie);
				Modss.last_view(e.object.movie);
			}
		});
		Lampa.Storage.listener.follow('change', function (e) {});
		Lampa.Settings.listener.follow('open', function (e) {
			if (e.name == 'main') {
				if (Lampa.Settings.main().render().find('[data-component="pub_param"]').length == 0) {
					Lampa.SettingsApi.addComponent({
						component: 'pub_param',
						name: 'KinoPub',
						icon: '<svg viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M19.7.5H4.3C2.2.5.5 2.2.5 4.3v15.4c0 2.1 1.7 3.8 3.8 3.8h15.4c2.1 0 3.8-1.7 3.8-3.8V4.3c0-2.1-1.7-3.8-3.8-3.8zM13 14.6H8.6c-.3 0-.5.2-.5.5v4.2H6V4.7h7c2.7 0 5 2.2 5 5 0 2.7-2.2 4.9-5 4.9z" fill="#ffffff" class="fill-000000 fill-ffffff"></path><path d="M13 6.8H8.6c-.3 0-.5.2-.5.5V12c0 .3.2.5.5.5H13c1.6 0 2.8-1.3 2.8-2.8.1-1.6-1.2-2.9-2.8-2.9z" fill="#ffffff" class="fill-000000 fill-ffffff"></path></svg>'
					});
				}
				if (Lampa.Settings.main().render().find('[data-component="fork_param"]').length == 0) {
					Lampa.SettingsApi.addComponent({
						component: 'fork_param',
						name: 'ForkTV',
						icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke="#ffffff" stroke-width="2" class="stroke-000000"><path d="M4.4 2h15.2A2.4 2.4 0 0 1 22 4.4v15.2a2.4 2.4 0 0 1-2.4 2.4H4.4A2.4 2.4 0 0 1 2 19.6V4.4A2.4 2.4 0 0 1 4.4 2Z"></path><path d="M12 20.902V9.502c-.026-2.733 1.507-3.867 4.6-3.4M9 13.5h6"></path></g></svg>'
					});
				}
				if (Lampa.Settings.main().render().find('[data-component="rezka_param"]').length == 0) {
					Lampa.SettingsApi.addComponent({
						component: 'rezka_param',
						name: 'HDRezka',
						icon: '<svg height="57" viewBox="0 0 58 57" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20.3735V45H26.8281V34.1262H36.724V26.9806H26.8281V24.3916C26.8281 21.5955 28.9062 19.835 31.1823 19.835H39V13H26.8281C23.6615 13 20 15.4854 20 20.3735Z" fill="white"/><rect x="2" y="2" width="54" height="53" rx="5" stroke="white" stroke-width="4"/></svg>'
					});
				}
				if (Lampa.Settings.main().render().find('[data-component="filmix_param"]').length == 0) {
					Lampa.SettingsApi.addComponent({
						component: 'filmix_param',
						name: 'Filmix',
						icon: '<svg height="57" viewBox="0 0 58 57" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20.3735V45H26.8281V34.1262H36.724V26.9806H26.8281V24.3916C26.8281 21.5955 28.9062 19.835 31.1823 19.835H39V13H26.8281C23.6615 13 20 15.4854 20 20.3735Z" fill="white"/><rect x="2" y="2" width="54" height="53" rx="5" stroke="white" stroke-width="4"/></svg>'
					});
				}
				if (Lampa.Settings.main().render().find('[data-component="modss_tv_param"]').length == 0) {
					Lampa.SettingsApi.addComponent({
						component: 'modss_tv_param',
						name: 'Modss-TV',
						icon: '<svg height="57px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" color="#fff" fill="currentColor" class="bi bi-tv"><path d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zM13.991 3l.024.001a1.46 1.46 0 0 1 .538.143.757.757 0 0 1 .302.254c.067.1.145.277.145.602v5.991l-.001.024a1.464 1.464 0 0 1-.143.538.758.758 0 0 1-.254.302c-.1.067-.277.145-.602.145H2.009l-.024-.001a1.464 1.464 0 0 1-.538-.143.758.758 0 0 1-.302-.254C1.078 10.502 1 10.325 1 10V4.009l.001-.024a1.46 1.46 0 0 1 .143-.538.758.758 0 0 1 .254-.302C1.498 3.078 1.675 3 2 3h11.991zM14 2H2C0 2 0 4 0 4v6c0 2 2 2 2 2h12c2 0 2-2 2-2V4c0-2-2-2-2-2z"/></svg>'
					});
				}
				Lampa.Settings.main().update();
				Lampa.Settings.main().render().find('[data-component="filmix"], [data-component="rezka_param"], [data-component="pub_param"], [data-component="filmix_param"], [data-component="fork_param"], [data-component="modss_tv_param"]').addClass('hide');
			}
			if (e.name == 'mods_proxy') {
				$('.settings__title').text(Lampa.Lang.translate('title_proxy') + " cloneMODS's");
				var ads = ['<div style="padding: 1.5em 2em; padding-top: 10px;">', '<div style="background: #3e3e3e; padding: 1em; border-radius: 0.3em;">', '<div style="font-size: 1em; margin-bottom: 1em; color: #ffd402;">#{info_attention} ⚠</div>', '<div style="line-height: 1.4;">#{online_proxy_title_descr}</div>', '</div>', '</div>'].join('');
				e.body.find('[data-name="mods_proxy_all"]').before(Lampa.Lang.translate(ads));
			} else $('.settings__title').text(Lampa.Lang.translate('menu_settings'));
			if (e.name == 'fork_param') $('.settings__title').append(" ForkTV");
			if (e.name == 'filmix_param') {
				var ads = ['<div style="padding: 1.5em 2em; padding-top: 10px;">', '<div style="background: #3e3e3e; padding: 1em; border-radius: 0.3em;">', '<div style="font-size: 1em; margin-bottom: 1em; color: #ffd402;">#{info_attention} ⚠</div>', '<div style="line-height: 1.4;">#{info_filmix_descr} <span style="color: #24b4f9">filmix.ac</span></div>', '</div>', '</div>'].join('');
				e.body.find('[data-static="true"]:eq(0)').after(Lampa.Lang.translate(ads));
				$('.settings__title').append(" Filmix");
			}
			if (e.name == 'pub_param') {
				var ads = ['<div style="padding: 1.5em 2em; padding-top: 10px;">', '<div style="background: #3e3e3e; padding: 1em; border-radius: 0.3em;">', '<div style="font-size: 1em; margin-bottom: 1em; color: #ffd402;">#{info_attention} ⚠</div>', '<div style="line-height: 1.4;">#{info_pub_descr} <span style="color: #24b4f9">kino.pub</span></div>', '</div>', '</div>'].join('');
				e.body.find('[data-static="true"]:eq(0)').after(Lampa.Lang.translate(ads));
				$('.settings__title').append(" KinoPub");
			}
			if (e.name == 'settings_modss') {
			  $('.settings__title').text("cloneMODS's");
			  var title = $('[data-name="priority_balanser"] .settings-param__value', e.body);
			  title.text(title.text().split('<').shift());
			}
		});
		
		function add() {
			Modss.init();
			//	Lampa.Storage.set('guide', '');
			setTimeout(function () {
				//if (window.innerHeight > 700 && Lampa.Storage.field('guide') == 'undefined') guide();
			}, 3000);
			Lampa.SettingsApi.addComponent({
				component: 'settings_modss',
				name: "cloneMODS's",
				icon: "<svg viewBox='0 0 24 24' xml:space='preserve' xmlns='https://www.w3.org/2000/svg'><path d='M19.7.5H4.3C2.2.5.5 2.2.5 4.3v15.4c0 2.1 1.7 3.8 3.8 3.8h15.4c2.1 0 3.8-1.7 3.8-3.8V4.3c0-2.1-1.7-3.8-3.8-3.8zm-2.1 16.4c.3 0 .5.2.5.5s-.2.5-.5.5h-3c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h1V8.4l-3.2 5.4-.1.1-.1.1h-.6s-.1 0-.1-.1l-.1-.1-3-5.4v8.5h1c.3 0 .5.2.5.5s-.2.5-.5.5h-3c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h1V7.1h-1c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h1.7c.1 0 .2.1.2.2l3.7 6.2 3.7-6.2.2-.2h1.7c.3 0 .5.2.5.5s-.2.5-.5.5h-1v9.8h1z' fill='#ffffff' class='fill-000000'></path></svg>"
			});
			Lampa.SettingsApi.addParam({
				component: 'settings_modss',
				param: {
					name: 'mods_status',
					type: 'title'
				},
				field: {
					name: '<div class="settings-folder" style="padding:0!important"><div style="width:3em;height:2.3em;margin-top:-.5em;padding-right:.5em"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm8 5.5v7h2v-7h-2zm-.285 0H8.601l-1.497 4.113L5.607 8.5H3.493l2.611 6.964h2L10.715 8.5zm5.285 5h1.5a2.5 2.5 0 1 0 0-5H14v7h2v-2zm0-2v-1h1.5a.5.5 0 1 1 0 1H16z" fill="#ffffff" class="fill-000000"></path></svg></div><div style="font-size:1.3em">Не активирован</div></div>',
					description: 'Активация Vip статуса происходит через бота @modssmy_bot'
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'settings_modss',
				param: {
					name: 'mods_password',
					type: 'static', //доступно select,input,trigger,title,static
					placeholder: Lampa.Lang.translate('placeholder_password'),
					values: '',
					default: ''
				},
				field: {
					name: Lampa.Lang.translate('title_parent_contr'),
					description: Lampa.Lang.translate('placeholder_password')
				},
				onRender: function (item) {
					function pass() {
						Lampa.Input.edit({
							value: '' + Lampa.Storage.get('mods_password') + '',
							free: true,
							nosave: true
						}, function (t) {
							Lampa.Storage.set('mods_password', t);
							Lampa.Settings.update();
						});
					}
					item.on('hover:enter', function () {
						if (Lampa.Storage.get('mods_password')) Lampa.Input.edit({
							value: '',
							title: 'Введите старый пароль',
							free: true,
							nosave: true
						}, function (t) {
							if (t == Lampa.Storage.get('mods_password')) pass();
							else Lampa.Noty.show('Неверный пароль');
						});
						else pass();
					});
					if (Lampa.Storage.get('mods_password')) item.find('.settings-param__descr').text('Изменить пароль');
					else item.find('.settings-param__descr').text(Lampa.Lang.translate('placeholder_password'));
				},
				onChange: function (value) {
					if (value) $('body').find('.settings-param__descr').text('Изменить пароль');
					else $('body').find('.settings-param__descr').text(Lampa.Lang.translate('placeholder_password'));
				}
			});
			//Add-ons
			Lampa.SettingsApi.addParam({
				component: 'settings_modss',
				param: {
					name: 'mods_title',
					type: 'title', //доступно select,input,trigger,title,static
					default: true
				},
				field: {
					name: Lampa.Lang.translate('title_addons')
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'settings_modss',
				param: {
					name: 'mods_onl',
					type: 'trigger', //доступно select,input,trigger,title,static
					default: true
				},
				field: {
					name: Lampa.Lang.translate('params_pub_on') + ' ' + Lampa.Lang.translate('title_online').toLowerCase(),
					description: Lampa.Lang.translate('onl_enable_descr')
				},
				onChange: function (value) {
					Modss.online(cards);
					Lampa.Settings.update();
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'settings_modss',
				param: {
					name: 'priority_balanser',
					type: 'select', //доступно select,input,trigger,title,static
					values: Modss.balansers(),
					default: 'filmix'
				},
				field: {
					name: Lampa.Lang.translate('title_prioriry_balanser'),
					description: Lampa.Lang.translate('title_prioriry_balanser_descr')
				},
				onRender: function (item) {
					if (Lampa.Storage.field('mods_onl')) item.show(); 
					else item.hide();
				}, 
				onChange: function (values) {
				  var title = $('body').find('[data-name="priority_balanser"] .settings-param__value');
			    title.text(title.text().split('<').shift());
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'settings_modss',
				param: {
					name: 'online_continued',
					type: 'trigger', //доступно select,input,trigger,title,static
					default: true
				},
				field: {
					name: Lampa.Lang.translate('title_online_continued'),
					description: Lampa.Lang.translate('title_online_descr')
				},
				onRender: function (item) {
					if (Lampa.Storage.field('mods_onl')) item.show(); 
					else item.hide();
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'settings_modss',
				param: {
					name: 'online_dash',
					type: 'trigger', //доступно select,input,trigger,title,static
					default: true
				},
				field: {
					name: Lampa.Lang.translate('online_dash')
				},
				onRender: function (item) {
					if (Lampa.Storage.field('mods_onl')) item.show(); 
					else item.hide();
				}
			});
			//Filmix
			Lampa.SettingsApi.addParam({
				component: 'settings_modss',
				param: {
					name: 'filmix_param',
					type: 'static', //доступно select,input,trigger,title,static
					default: true
				},
				field: {
					name: '<div class="settings-folder" style="padding:0!important"><div style="width:1.8em;height:1.3em;padding-right:.5em"><svg height="26" width="26" viewBox="0 0 58 57" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20.3735V45H26.8281V34.1262H36.724V26.9806H26.8281V24.3916C26.8281 21.5955 28.9062 19.835 31.1823 19.835H39V13H26.8281C23.6615 13 20 15.4854 20 20.3735Z" fill="white"/><rect x="2" y="2" width="54" height="53" rx="5" stroke="white" stroke-width="4"/></svg></div><div style="font-size:1.3em">Filmix</div></div>',
					description: ' '
				},
				onRender: function (item) {
					if (Lampa.Storage.field('mods_onl')) {
						item.show();
						$('.settings-param__name', item).before('<div class="settings-param__status"></div>');
						Filmix.showStatus(item);
					} else item.hide();
					item.on('hover:enter', function () {
						Lampa.Settings.create('filmix_param');
					});
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'filmix_param',
				param: {
					name: 'filmix_status',
					type: 'title', //доступно select,input,trigger,title,static
					default: ''
				},
				field: {
					name: '<b style="color:#fff">' + Lampa.Lang.translate('title_status') + '</b>',
					description: ' '
				},
				onRender: function (item) {
					$('.settings-param__descr', item).before('<div class="settings-param__status"></div>');
					Filmix.showStatus(item);
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'filmix_param',
				param: {
					name: 'filmix_token',
					type: 'input', //доступно select,input,trigger,title,static
					values: '',
					placeholder: Lampa.Lang.translate('filmix_param_placeholder'),
					default: ''
				},
				field: {
					name: Lampa.Lang.translate('filmix_param_add_title'),
					description: Lampa.Lang.translate('filmix_param_add_descr')
				},
				onChange: function (value) {
					if (value) Filmix.checkPro(value);
					else {
						Lampa.Storage.set("filmix_status", {});
						Filmix.showStatus();
					}
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'filmix_param',
				param: {
					name: 'filmix_add',
					type: 'static', //доступно select,input,trigger,title,static
					default: ''
				},
				field: {
					name: Lampa.Lang.translate('filmix_params_add_device') + ' Filmix',
					description: ''
				},
				onRender: function (item) {
					item.on('hover:enter', function () {
						Filmix.add_new();
					});
				}
			});
			//KinoPub
			Lampa.SettingsApi.addParam({
				component: 'settings_modss',
				param: {
					name: 'mods_pub',
					type: 'trigger', //доступно select,input,trigger,title,static
					default: false
				},
				field: {
					name: Lampa.Lang.translate('params_pub_on') + ' KinoPub',
					description: Lampa.Lang.translate('params_pub_on_descr')
				},
				onChange: function (value) {
					if (value == 'false') Lampa.Storage.set('source', 'tmdb');
					Lampa.Settings.update();
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'settings_modss',
				param: {
					name: 'pub_param',
					type: 'static', //доступно select,input,trigger,title,static
					default: true
				},
				field: {
					name: '<div class="settings-folder" style="padding:0!important"><div style="width:1.8em;height:1.3em;padding-right:.5em"><svg height="26" width="26" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M19.7.5H4.3C2.2.5.5 2.2.5 4.3v15.4c0 2.1 1.7 3.8 3.8 3.8h15.4c2.1 0 3.8-1.7 3.8-3.8V4.3c0-2.1-1.7-3.8-3.8-3.8zM13 14.6H8.6c-.3 0-.5.2-.5.5v4.2H6V4.7h7c2.7 0 5 2.2 5 5 0 2.7-2.2 4.9-5 4.9z" fill="#ffffff" class="fill-000000 fill-ffffff"></path><path d="M13 6.8H8.6c-.3 0-.5.2-.5.5V12c0 .3.2.5.5.5H13c1.6 0 2.8-1.3 2.8-2.8.1-1.6-1.2-2.9-2.8-2.9z" fill="#ffffff" class="fill-000000 fill-ffffff"></path></svg></div><div style="font-size:1.3em">KinoPub</div></div>',
					description: Lampa.Lang.translate('filmix_nodevice')
				},
				onRender: function (item) {
					if (Lampa.Storage.field('mods_pub')) {
						item.show();
						$('.settings-param__name', item).before('<div class="settings-param__status"></div>');
						Pub.userInfo(item, true);
					} else item.hide();
					item.on('hover:enter', function () {
						Lampa.Settings.create('pub_param');
					});
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'pub_param',
				param: {
					name: 'pub_auth',
					type: 'static' //доступно select,input,trigger,title,static
				},
				field: {
					name: ' ',
					description: ' ',
				},
				onRender: function (item) {
					$('.settings-param__name', item).before('<div class="settings-param__status"></div>');
					Pub.userInfo(item);
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'pub_param',
				param: {
					name: 'pub_auth_add',
					type: 'static' //доступно select,input,trigger,title,static
				},
				field: {
					name: Lampa.Lang.translate('filmix_params_add_device') + ' KinoPub',
					description: Lampa.Lang.translate('pub_auth_add_descr')
				},
				onRender: function (item) {
					item.on('hover:enter', function () {
						Pub.Auth_pub();
					});
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'pub_param',
				param: {
					name: 'pub_parametrs',
					type: 'static' //доступно select,input,trigger,title,static
				},
				field: {
					name: Lampa.Lang.translate('title_settings'),
					description: Lampa.Lang.translate('descr_pub_settings')
				},
				onRender: function (item) {
					if (!Lampa.Storage.get('logined_pub')) item.hide();
					item.on('hover:enter', function () {
						Pub.info_device();
					});
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'pub_param',
				param: {
					name: 'pub_source',
					type: 'static' //доступно select,input,trigger,title,static
				},
				field: {
					name: Lampa.Lang.translate('params_pub_add_source'),
					description: Lampa.Lang.translate('params_pub_add_source_descr')
				},
				onRender: function (item) {
					item.on('hover:enter', function () {
						Lampa.Noty.show(Lampa.Lang.translate('pub_source_add_noty'));
						Lampa.Storage.set('source', 'pub');
					});
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'pub_param',
				param: {
					name: 'pub_refresh_token',
					type: 'static' //доступно select,input,trigger,title,static
				},
				field: {
					name: Lampa.Lang.translate('params_pub_update_tocken')
				},
				onRender: function (item) {
					if (!Lampa.Storage.get('pub_access_token') || !Lampa.Storage.get('logined_pub')) item.hide();
					item.on('hover:enter', function () {
						Pub.refreshTok();
					});
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'pub_param',
				param: {
					name: 'pub_del_device',
					type: 'static' //доступно select,input,trigger,title,static
				},
				field: {
					name: Lampa.Lang.translate('params_pub_dell_device'),
					description: Lampa.Lang.translate('params_pub_dell_descr')
				},
				onRender: function (item) {
					item.on('hover:enter', function () {
						Pub.delete_device(function () {
							Lampa.Settings.create('pub_param');
						});
					});
					if (!Lampa.Storage.get('pub_access_token') || !Lampa.Storage.get('logined_pub')) item.hide();
				}
			});			//ForkTV
			Lampa.SettingsApi.addParam({
				component: 'settings_modss',
				param: {
					name: 'mods_fork',
					type: 'trigger', //доступно select,input,trigger,title,static
					default: false
				},
				field: {
					name: Lampa.Lang.translate('params_pub_on') + ' ForkTV',
					description: Lampa.Lang.translate('fork_enable_descr')
				},
				onChange: function (value) {
					if (value) ForkTV.check_forktv('', true);
					Lampa.Settings.update();
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'settings_modss',
				param: {
					name: 'fork_param',
					type: 'static', //доступно select,input,trigger,title,static
					default: true
				},
				field: {
					name: '<div class="settings-folder" style="padding:0!important"><div style="width:1.8em;height:1.3em;padding-right:.5em"><svg height="26" width="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke="#ffffff" stroke-width="2" class="stroke-000000"><path d="M4.4 2h15.2A2.4 2.4 0 0 1 22 4.4v15.2a2.4 2.4 0 0 1-2.4 2.4H4.4A2.4 2.4 0 0 1 2 19.6V4.4A2.4 2.4 0 0 1 4.4 2Z"></path><path d="M12 20.902V9.502c-.026-2.733 1.507-3.867 4.6-3.4M9 13.5h6"></path></g></svg></div><div style="font-size:1.3em">ForkTV</div></div>',
					description: Lampa.Lang.translate('filmix_nodevice')
				},
				onRender: function (item) {
					if (Lampa.Storage.field('mods_fork')) {
						item.show();
						$('.settings-param__name', item).before('<div class="settings-param__status"></div>');
						ForkTV.check_forktv(item, true);
					} else item.hide();
					item.on('hover:enter', function () {
						Lampa.Settings.create('fork_param');
					});
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'fork_param',
				param: {
					name: 'forktv_url',
					type: 'static' //доступно select,input,trigger,title,static
				},
				field: {
					name: 'http://no_save.forktv.me',
					description: Lampa.Lang.translate('filmix_nodevice')
				},
				onRender: function (item) {
					$('.settings-param__name', item).before('<div class="settings-param__status"></div>');
					ForkTV.check_forktv(item);
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'fork_param',
				param: {
					name: 'ForkTV_add',
					type: 'static', //доступно select,input,trigger,title,static
					default: ''
				},
				field: {
					name: Lampa.Storage.get('ForkTv_cat') ? Lampa.Lang.translate('title_fork_edit_cats') : Lampa.Lang.translate('title_fork_add_cats'),
					description: ''
				},
				onRender: function (item) {
					if (Lampa.Storage.get('forktv_auth')) {
						item.show();
					} else item.hide();
					item.on('hover:enter', function () {
						ForkTV.check_forktv(item);
					});
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'fork_param',
				param: {
					name: 'ForkTV_clear',
					type: 'static', //доступно select,input,trigger,title,static
					default: ''
				},
				field: {
					name: Lampa.Lang.translate('title_fork_clear'),
					description: Lampa.Lang.translate('title_fork_clear_descr')
				},
				onRender: function (item) {
					if (Lampa.Storage.get('forktv_auth')) {
						item.show();
					} else item.hide();
					item.on('hover:enter', function () {
						Lampa.Storage.set('ForkTv_cat', '');
						Lampa.Noty.show(Lampa.Lang.translate('title_fork_clear_noty'));
					});
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'fork_param',
				param: {
					name: 'ForkTV_clearMac',
					type: 'static', //доступно select,input,trigger,title,static
					default: ''
				},
				field: {
					name: Lampa.Lang.translate('title_fork_reload_code') + ' ID/MAC',
					description: ' '
				},
				onRender: function (item) {
					$('.settings-param__descr', item).text(Lampa.Lang.translate('title_fork_current') + ' ID/MAC: ' + ForkTV.forktv_id);
					item.on('hover:enter', function () {
						ForkTV.updMac(item);
					});
				}
			});
			//Radio
			Lampa.SettingsApi.addParam({
				component: 'settings_modss',
				param: {
					name: 'mods_radio',
					type: 'trigger', //доступно select,input,trigger,title,static
					default: false
				},
				field: {
					name: Lampa.Lang.translate('params_radio_enable'),
					description: Lampa.Lang.translate('params_radio_enable_descr')
				},
				onChange: function (value) {
					Modss.radio();
				}
			});
			//Collection
			Lampa.SettingsApi.addParam({
				component: 'settings_modss',
				param: {
					name: 'mods_collection',
					type: 'trigger', //доступно select,input,trigger,title,static
					default: false
				},
				field: {
					name: Lampa.Lang.translate('params_pub_on') + ' ' + Lampa.Lang.translate('menu_collections').toLowerCase(),
					description: Lampa.Lang.translate('params_collections_descr')
				},
				onChange: function (value) {
					if (value == 'true') Modss.collections();
					else $('body').find('.menu [data-action="collection"]').remove();
				}
			});
			//Styles
			Lampa.SettingsApi.addParam({
				component: 'settings_modss',
				param: {
					name: 'mods_title',
					type: 'title', //доступно select,input,trigger,title,static
					default: true
				},
				field: {
					name: Lampa.Lang.translate('params_styles_title')
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'settings_modss',
				param: {
					name: 'mods_rating',
					type: 'trigger', //доступно select,input,trigger,title,static
					default: true
				},
				field: {
					name: Lampa.Lang.translate('title_enable_rating'),
					description: Lampa.Lang.translate('title_enable_rating_descr')
				},
				onChange: function (value) {
					if ($('body').find('.full-start__poster').length && value == 'true') $('body').find('.rate--kp, .rate--imdb').removeClass('hide');
					else $('body').find('.rate--kp, .rate--imdb').addClass('hide');
				}
			});
			Lampa.SettingsApi.addParam({
				component: 'settings_modss',
				param: {
					name: 'mods_serial_info',
					type: 'trigger', //доступно select,input,trigger,title,static
					default: true
				},
				field: {
					name: Lampa.Lang.translate('title_info_serial'),
					description: Lampa.Lang.translate('title_info_serial_descr')
				},
				onChange: function (value) {
					if (value == 'true' && $('body').find('.full-start__poster').length) Modss.serialInfo(cards);
					else $('body').find('.files__left .time-line, .card--last_view, .card--new_seria').remove();
				}
			});
			if (/iPhone|iPad|iPod|android|x11/i.test(navigator.userAgent) || (Lampa.Platform.is('android') && window.innerHeight < 1080)) {
				Lampa.SettingsApi.addParam({
					component: 'settings_modss',
					param: {
						name: 'mods_butt_back',
						type: 'trigger', //доступно select,input,trigger,title,static
						default: false
					},
					field: {
						name: Lampa.Lang.translate('title_add_butback'),
						description: Lampa.Lang.translate('title_add_butback_descr')
					},
					onChange: function (value) {
						Lampa.Settings.update();
						if (value == 'true') Modss.buttBack();
						else $('body').find('.elem-mobile-back').remove();
					}
				});
				Lampa.SettingsApi.addParam({
					component: 'settings_modss',
					param: {
						name: 'mods_butt_pos',
						type: 'select', //доступно select,input,trigger,title,static
						values: {
							right: Lampa.Lang.translate('buttback_right'),
							left: Lampa.Lang.translate('buttback_left')
						},
						default: 'right'
					},
					field: {
						name: Lampa.Lang.translate('title_butback_pos'),
					},
					onRender: function (item) {
						if (Lampa.Storage.field('mods_butt_back')) item.show();
						else item.hide();
					},
					onChange: function (value) {
						Modss.buttBack(value);
					}
				});
			}
			//Proxy mods
			Lampa.SettingsApi.addComponent({
				component: 'mods_proxy',
				name: Lampa.Lang.translate('title_proxy') + ' cloneMODS\'s',
				icon: '<svg fill=none height=46 viewBox="0 0 42 46"xmlns=http://www.w3.org/2000/svg><rect height=18 rx=1.5 width=39 y=26.5 x=1.5 stroke=white stroke-width=3 /><circle cx=9.5 cy=35.5 fill=white r=3.5 /><circle cx=26.5 cy=35.5 fill=white r=2.5 /><circle cx=32.5 cy=35.5 fill=white r=2.5 /><circle cx=21.5 cy=5.5 fill=white r=5.5 /><rect height=3 rx=1.5 width=11 y=4 fill=white x=31 /><rect height=3 rx=1.5 width=11 y=4 fill=white /><rect height=7 rx=1.5 width=3 y=14 fill=white x=20 /></svg>'
			});
			Lampa.SettingsApi.addParam({
				component: 'mods_proxy',
				param: {
					name: 'mods_proxy_all',
					type: 'input', //доступно select,input,trigger,title,static
					values: '',
					default: '',
					placeholder: Lampa.Lang.translate('online_proxy_placeholder')
				},
				field: {
					name: Lampa.Lang.translate('online_proxy_title'),
					description: Lampa.Lang.translate('online_proxy_descr')
				}
			});
		  ['VideoCDN', 'HDRezka', 'Kinobase', 'Collaps'].forEach(function (itm) {
				Lampa.SettingsApi.addParam({
					component: 'mods_proxy',
					param: {
						name: 'mods_proxy_' + itm.toLowerCase(),
						type: 'select', //доступно select,input,trigger,title,static
						values: {
							on: Lampa.Lang.translate('params_pub_on'),
							off: Lampa.Lang.translate('params_pub_off'),
							url: Lampa.Lang.translate('online_proxy_url')
						},
						default: 'off'
					},
					field: {
						name: itm,
						description: Lampa.Storage.get('onl_mods_proxy_' + itm.toLowerCase()) || ' '
					},
					onRender: function (item) {
						var url = Lampa.Storage.get('onl_mods_proxy_' + itm.toLowerCase());
						if (url.length > 0) item.find('.settings-param__descr').text(url);
						if (url.length == 0) item.find('.settings-param__descr').addClass('hide');
						//вызывается когда срабатывает рендер параметра
					},
					onChange: function (value) {
						if (value == 'url') {
							var name = itm.toLowerCase();
							Lampa.Input.edit({
								value: Lampa.Storage.get('onl_mods_proxy_' + name) || '',
							}, function (t) {
								if (t !== '') {
									Lampa.Storage.set('onl_mods_proxy_' + name, t);
									$('[data-name="mods_proxy_' + name).find('.settings-param__descr').removeClass('hide').text(t);
								} else if (t == '') {
									Lampa.Storage.set('mods_proxy_' + name, 'off');
									Lampa.Storage.set('onl_mods_proxy_' + name, '');
									$('[data-name="mods_proxy_' + name + '"]').find('.settings-param__descr').addClass('hide').text('');
								}
							});
						}
					}
				});
			});
			//Close_app 
			if (Lampa.Platform.is('android')) {
				Lampa.SettingsApi.addComponent({
					component: 'mods_exit',
					name: Lampa.Lang.translate('title_close_app'),
					icon: '<svg data-name="Layer 1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect height="46" rx="4" ry="4" width="46" x="1" y="1" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px" class="stroke-1d1d1b"></rect><path d="m12 12 24 24M12 36l24-24" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px" class="stroke-1d1d1b"></path></svg>'
				});
				Lampa.SettingsApi.addParam({
					component: 'mods_exit',
					param: {
						name: 'close_app',
						type: 'static', //доступно select,input,trigger,title,static
						default: true
					},
					field: {
						name: ''
					},
					onRender: function (item) {
						Lampa.Android.exit();
					}
				});
			}
			$('body').append(Lampa.Template.get('hdgo_style', {}, true));
			$('body').append(Lampa.Template.get('modss_style', {}, true));
			$('body').append(Lampa.Template.get('onlines_prestige_css', {}, true));
		}
		
		if (window.appready) add();else {
      Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') add();
      });
    }
		
		function url$1(u) {
			var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			if (params.genres) u = add$5(u, 'genre=' + params.genres);
			if (params.page) u = add$5(u, 'page=' + params.page);
			if (params.query) u = add$5(u, 'q=' + params.query);
			if (params.type) u = add$5(u, 'type=' + params.type);
			if (params.field) u = add$5(u, 'field=' + params.field);
			if (params.id) u = add$5(u, 'actor=' + params.id);
			if (params.perpage) u = add$5(u, 'perpage=' + params.perpage);
			u = add$5(u, 'access_token=' + Pub.token);
			if (params.filter) {
				for (var i in params.filter) {
					u = add$5(u, i + '=' + params.filter[i]);
				}
			}
			return Pub.baseurl + u;
		}
		function add$5(u, params) {
			return u + (/\?/.test(u) ? '&' : '?') + params;
		}
		function get$6(method, call) {
			var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var oncomplite = arguments.length > 2 ? arguments[2] : undefined;
			var onerror = arguments.length > 3 ? arguments[3] : undefined;
			var u = url$1(method, params);
			Pub.network.silent(u, function (json) {
				json.url = method;
				oncomplite(json);
			}, onerror);
		}
		function tocard(element) {
			return {
				url: '',
				id: element.id,
				type: element.type,
				title: element.title.split('/')[0],
				original_title: element.title.split('/')[1] || element.title,
				release_date: (element.year ? element.year + '' : element.years ? element.years[0] + '' : '0000'),
				first_air_date: element.type == 'serial' || element.type == 'docuserial' || element.type == 'tvshow' ? element.year : '',
				vote_averagey: parseFloat((element.imdb_rating || 0) + '').toFixed(1),
				vote_average: element.imdb_rating || 0,
				poster: element.posters.big,
				background_image: element.posters.wide,
        imdb_rating: parseFloat(element.imdb_rating || '0.0').toFixed(1),
        kp_rating: parseFloat(element.kinopoisk_rating || '0.0').toFixed(1),
				year: element.year,
				years: element.years
			};
		}
		function list$2(params, oncomplite, onerror) {
			var url = url$1('v1/items', params, params.type = type);
			if (!params.genres) url = url$1(params.url, params);
			Pub.network["native"](url, function (json) {
				var items = [];
				if (json.items) {
					json.items.forEach(function (element) {
						items.push(tocard(element));
					});
				}
				oncomplite({
					results: items,
					page:json.pagination.current,
					total_pages: json.pagination.total
				});
			}, onerror);
		}
		function main$2(params, oncomplite, onerror) {
			var status = new Lampa.Status(9);
			status.onComplite = function () {
				var fulldata = [];
				var data = status.data;
				for (var i = 1; i <= 9; i++) {
					var ipx = 's' + i;
					if (data[ipx] && data[ipx].results.length) fulldata.push(data[ipx]);
				}
				if (fulldata.length) oncomplite(fulldata);
				else onerror();
			};
			var append = function append(title, name, json) {
				json.title = title;
				var data = [];
				json.items.forEach(function (element) {
					data.push(tocard(element));
				});
				json.results = data;
				status.append(name, json);
			};
			get$6('v1/items/popular?type=movie&sort=views', params, function (json) {
				append(Lampa.Lang.translate('pub_title_popularfilm'), 's1', json);
			}, status.error.bind(status));
			get$6('v1/items/fresh?type=movie', params, function (json) {
				append(Lampa.Lang.translate('pub_title_newfilm'), 's2', json);
			}, status.error.bind(status));
			get$6('v1/items/popular?type=serial&sort=views', params, function (json) {
				append(Lampa.Lang.translate('pub_title_popularserial'), 's3', json);
			}, status.error.bind(status));
			get$6('v1/items/fresh?type=serial', params, function (json) {
				append(Lampa.Lang.translate('pub_title_newserial'), 's4', json);
			}, status.error.bind(status));
			get$6('v1/items/fresh?type=concert', params, function (json) {
				append(Lampa.Lang.translate('pub_title_newconcert'), 's5', json);
			}, status.error.bind(status));
			get$6('v1/items?type=&quality=4', params, function (json) {
				append('4K', 's6', json);
			}, status.error.bind(status));
			get$6('v1/items/fresh?type=documovie', params, function (json) {
				append(Lampa.Lang.translate('pub_title_newdocfilm'), 's7', json);
			}, status.error.bind(status));
			get$6('v1/items/fresh?type=docuserial', params, function (json) {
				append(Lampa.Lang.translate('pub_title_newdocserial'), 's8', json);
			}, status.error.bind(status));
			get$6('v1/items/fresh?type=tvshow', params, function (json) {
				append(Lampa.Lang.translate('pub_title_newtvshow'), 's9', json);
			}, status.error.bind(status));
		}
		function category$1(params, oncomplite, onerror) {
			var books = Lampa.Favorite.continues(params.url);
			var status = new Lampa.Status(5);
			status.onComplite = function () {
				var fulldata = [];
				if (books.length) fulldata.push({
					results: books,
					title: params.url == 'tv' ? Lampa.Lang.translate('title_continue') : Lampa.Lang.translate('title_watched')
				});
				var data = status.data;
				for (var i = 1; i <= 5; i++) {
					var ipx = 's' + i;
					if (data[ipx] && data[ipx].results.length) fulldata.push(data[ipx]);
				}
				if (fulldata.length) oncomplite(fulldata);
				else onerror();
			};
			var append = function append(title, name, json) {
				json.title = title;
				var data = [];
				json.items.forEach(function (element) {
					data.push(tocard(element));
				});
				json.results = data;
				status.append(name, json);
			};
			var type = params.url == 'tv' ? 'serial' : params.url;
			var Name = params.genres ? params.typeName.toLowerCase() : params.url == 'tv' ? Lampa.Lang.translate('menu_tv').toLowerCase() : Lampa.Lang.translate('menu_movies').toLowerCase();
			if (params.genres) {
				get$6('v1/items?type=' + type + (params.genres ? '&sort=created-' : ''), params, function (json) {
					append(Lampa.Lang.translate('pub_title_allingenre') + ' ' + params.janr.toLowerCase(), 's1', json);
				}, status.error.bind(status));
				get$6('v1/items?type=' + type + 'sort=rating-', params, function (json) {
					append(Lampa.Lang.translate('pub_title_rating') + ' ' + Name, 's2', json);
				}, status.error.bind(status));
				get$6('v1/items?type=' + type + '&sort=updated-', params, function (json) {
					append(Lampa.Lang.translate('pub_title_new') + ' ' + Name, 's3', json);
				}, status.error.bind(status));
				get$6('v1/items?type=' + type + '&sort=views-', params, function (json) {
					append(Lampa.Lang.translate('pub_title_hot') + ' ' + Name, 's4', json);
				}, status.error.bind(status));
				get$6('v1/items?type=' + type + '&quality=4', params, function (json) {
					append('4K ' + Name, 's5', json);
				}, status.error.bind(status));
			} else {
				get$6('v1/items?type=' + type + (params.genres ? '&sort=created-' : ''), params, function (json) {
					append(Lampa.Lang.translate('pub_title_all') + ' ' + Name, 's1', json);
				}, status.error.bind(status));
				get$6('v1/items/popular?type=' + type + '&sort=views-&conditions=' + encodeURIComponent("year=" + Date.now('Y')), params, function (json) {
					append(Lampa.Lang.translate('pub_title_popular') + ' ' + Name, 's2', json);
				}, status.error.bind(status));
				get$6('v1/items/fresh?type=' + type + '&sort=views-&conditions=' + encodeURIComponent("year=" + Date.now('Y')), params, function (json) {
					append(Lampa.Lang.translate('pub_title_new') + ' ' + Name, 's3', json);
				}, status.error.bind(status));
				get$6('v1/items/hot?type=' + type + '&sort=created-&conditions=' + encodeURIComponent("year=" + Date.now('Y')), params, function (json) {
					append(Lampa.Lang.translate('pub_title_hot') + ' ' + Name, 's4', json);
				}, status.error.bind(status));
				get$6('v1/items?type=' + type + '&quality=4', params, function (json) {
					append('4K ' + Name, 's5', json);
				}, status.error.bind(status));
			}
		}
		function full$1(params, oncomplite, onerror) {
			var status = new Lampa.Status(Lampa.Storage.get('pro_pub', false) ? 5 : 4);
			status.onComplite = oncomplite;
			var url = 'v1/items/' + params.id;
			get$6(url, params, function (json) {
				json.source = 'pub';
				var data = {};
				var element = json.item;
				var url2 = 'v1/items/similar?id=' + element.id;
				get$6(url2, params, function (json) {
					var similars = [];
					if (json.items) {
						for (var i in json.items) {
							var item = json.items[i];
							similars.push(tocard(item));
						}
						status.append('simular', {
							results: similars
						});
					}
				}, onerror);
				var url3 = 'v1/items/comments?id=' + element.id;
				get$6(url3, params, function (json) {
					var comments = [];
					if (json.comments) {
						for (var i in json.comments) {
							var com = json.comments[i];
							com.text = com.message.replace(/\\[n|r|t]/g, '');
							com.like_count = com.rating;
							comments.push(com);
						}
						status.append('comments', comments);
					}
				}, onerror);
				data.movie = {
					id: element.id,
					url: url,
					type: element.type,
					source: 'pub',
					title: element.title.split('/')[0],
					original_title: element.title.split('/')[1] ? element.title.split('/')[1] : element.title.split('/')[0],
					name: element.seasons ? element.title.split('/')[0] : '',
					original_name: element.seasons ? element.title.split('/')[1] : '',
					overview: element.plot.replace(/\\[n|r|t]/g, ''),
					img: element.posters.big,
					runtime: (element.duration.average || 0) / 1000 / 6 * 100,
					genres: genres$1(element, json.item),
					vote_average: parseFloat(element.imdb_rating || element.kinopoisk_rating || '0'),
					production_companies: [],
					production_countries: countries(element.countries, json.item),
					budget: element.budget || 0,
					release_date: element.year || Lampa.Utils.parseTime(element.created_at).full || '0000',
					number_of_seasons: seasonsCount(element).seasons,
					number_of_episodes: seasonsCount(element).episodes,
					first_air_date: element.type == 'serial' || element.type == 'docuserial' || element.type == 'tvshow' ? element.year || Lampa.Utils.parseTime(element.created_at).full || '0000' : '', 
					background_image: element.posters.wide,
          imdb_rating: parseFloat(element.imdb_rating || '0.0').toFixed(1),
          kp_rating: parseFloat(element.kinopoisk_rating || '0.0').toFixed(1),
				};
				status.append('persons', persons(json));
				status.append('movie', data.movie);
				if(Lampa.Storage.get('pro_pub', false)) status.append('videos', videos(element));
			}, onerror);
		}
		function menu$1(params, oncomplite) {
			var u = url$1('v1/types', params);
			var typeName = '';
			Pub.network.silent(u, function (json) {
				Lampa.Select.show({
					title: Lampa.Lang.translate('title_category'),
					items: json.items,
					onBack: this.onBack,
					onSelect: function onSelect(a) {
						type = a.id;
						typeName = a.title;
						get$6('v1/genres?type=' + a.id, params, function (jsons) {
							Lampa.Select.show({
								title: Lampa.Lang.translate('full_genre'),
								items: jsons.items,
								onBack: function onBack() {
									menu$1(params, oncomplite);
								},
								onSelect: function onSelect(a) {
									Lampa.Activity.push({
										url: type,
										title: Lampa.Lang.translate('title_catalog') + ' - ' + typeName + ' - ' + a.title + ' - KinoPUB',
										component: 'category',
										typeName: typeName,
										janr: a.title,
										genres: a.id,
										id: a.id,
										source: 'pub',
										card_type: true,
										page: 1
									});
								}
							});
						}, onerror);
					}
				});
			});
		}
		function seasons$1(tv, from, oncomplite) {
			Lampa.Api.sources.tmdb.seasons(tv, from, oncomplite);
		}
		function person$2(params, oncomplite, onerror) {
			var u = url$1('v1/items', params);
			Pub.network.silent(u, function (json, all) {
				var data = {};
				if (json.items) {
					data.person = {
						name: params.id,
						biography: '',
						img: '',
						place_of_birth: '',
						birthday: '----'
					};
					var similars = [];
					for (var i in json.items) {
						var item = json.items[i];
						similars.push(tocard(item));
					}
					data.movie = {
						results: similars
					};
				}
				oncomplite(data);
			}, onerror);
		}
		function clear$3() {
			Pub.network.clear();
		}
		function seasonsCount(element) {
			var data = {
				seasons: 0,
				episodes: 0
			};
			if (element.seasons) {
				data.seasons = element.seasons.length;
				element.seasons.forEach(function (ep) {
					data.episodes += ep.episodes.length;
				})
			}
			return data;
		}
		function videos(element) {
			var data = [];
			if (element.trailer) {
				data.push({
					name: element.trailer.title,
					url: element.trailer.url,
					player: true
				});
			}
			return data.length ? {
				results: data
			} : false;
		}
		function persons(json) {
			var data = [];
			if (json.item.cast) {
				json.item.cast.split(',').forEach(function (name) {
					data.push({
						name: name,
						id: name,
						character: Lampa.Lang.translate('title_actor'),
					});
				});
			}
			return data.length ? {
				cast: data
			} : false;
		}
		function genres$1(element, json) {
			var data = [];
			element.genres.forEach(function (id) {
				if (id) {
					data.push({
						id: id.id,
						name: id.title
					});
				}
			});
			return data;
		}
		function countries(element, json) {
			var data = [];
			if (element && json.countries) {
				data.push({
					name: element[0].title
				});
			}
			return data;
		}
		function search$3() {
			var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
			var status = new Lampa.Status(2);
			status.onComplite = function (data) {
				var items = [];
				if (data.movie && data.movie.results.length) items.push(data.movie);
				if (data.tv && data.tv.results.length) items.push(data.tv);
				oncomplite(items);
			};
			var mov = params;
			mov.type = 'movie';
			mov.field = 'title';
			mov.perpage = 20;
			get$6('v1/items/search', mov, function (json) {
				var items = [];
				if (json.items) {
					json.items.forEach(function (element) {
						items.push(tocard(element));
					});
					var data = {
						results: items,
						page: json.pagination.current,
						total_pages: json.pagination.total,
						total_results: json.pagination.total_items,
						title: Lampa.Lang.translate('menu_movies'),
						type: 'movie'
					};
					status.append('movie', data);
				}
			}, status.error.bind(status));
			var tv = params;
			tv.type = 'serial';
			tv.field = 'title';
			tv.perpage = 20;
			get$6('v1/items/search', tv, function (json) {
				var items = [];
				if (json.items) {
					json.items.forEach(function (element) {
						items.push(tocard(element));
					});
					var data = {
						results: items,
						page: 1,
						total_pages: json.pagination.total,
						total_results: json.pagination.total_items,
						title: Lampa.Lang.translate('menu_tv'),
						type: 'serial'
					};
					status.append('tv', data);
				}
			}, status.error.bind(status));
		}
		function discovery() {
			return {
				title: 'PUB',
				search: search$3,
				params: {
					align_left: true,
					object: {
						source: 'pub'
					}
				},
				onMore: function onMore(params) {
					console.log(params)
					Lampa.Activity.push({
						url: 'v1/items/search?field=title&type=' + params.data.type,
						title: Lampa.Lang.translate('search') + ' - ' + params.query,
						component: 'category_full',
						page: 2,
						query: encodeURIComponent(params.query),
						source: 'pub'
					});
				},
				onCancel: Pub.network.clear.bind(Pub.network)
			};
		}
		var PUB = {
			main: main$2,
			menu: menu$1,
			full: full$1,
			search: search$3,
			person: person$2,
			list: list$2,
			seasons: seasons$1,
			category: category$1,
			clear: clear$3,
			discovery: discovery
		};
		Lampa.Api.sources.pub = PUB;
    
    function include(url) {
      var script = document.createElement('script');
      script.src = url;
      document.getElementsByTagName('head')[0].appendChild(script);
    }
    include('https://www.googletagmanager.com/gtag/js?id=G-8LVPC3VETR');
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-8LVPC3VETR');
    
		function guide() {
			var guide = '<style>.modal img {width:2000px!important;max-height:22em!important;height:auto} </style><div class="setorrent-checklist"><div class="torrent-checklist__descr">Вас приветствует Guide по использованию и настройке приложения Lampa.<br> Мы пройдём с Вами краткую инструкцию по основным этапам приложения.</div><div class="torrent-checklist__progress-steps">Пройдено 0 из 0</div><div class="torrent-checklist__progress-bar"><div style="width:0"></div></div><div class="torrent-checklist__content"><div class="torrent-checklist__steps hide"><ul class="torrent-checklist__list"><li>Парсер</li><li>Включение парсера</li><li>Плагины</li><li>Добавление плагина</li><li>Установка плагина</li><li>Балансер</li><li>Смена балансера</li><li>Фильтр</li><li>Применение фильтра</li></ul></div><div class="torrent-checklist__infoS"><div class="hide">Откройте Настройки, после перейдите в раздел "Парсер".<hr><img src="http://lampa.stream/img/guide/open_parser.jpg"></div><div class="hide">В пункте "Использовать парсер" переведите функцию в положение "Да", после чего в карточке фильма или сериала появится кнопка "Торренты".<hr><img src="http://lampa.stream/img/guide/add_parser.jpg"></div><div class="hide">Установка плагинов<hr><img src="http://lampa.stream/img/guide/add_plugin.jpg"></div><div class="hide">Для добавления плагинов воспользуйтесь следующими вариантами.<hr><img src="http://lampa.stream/img/guide/options_install.jpg"></div><div class="hide">Для добавления плагина, воспользуйтесь списком плагинов<hr><img src="http://lampa.stream/img/guide/install_plugin.jpg"></div><div class="hide">Для смены "Онлайн" источника, воспользуйтесь кнопкой Балансер.<hr><img src="http://lampa.stream/img/guide/open_balanser.jpg"></div><div class="hide">В случае, если источник не работает (нет подключения к сети) выберете в разделе "Балансер" другой источник.<hr><img src="http://lampa.stream/img/guide/balansers_change.jpg"></div><div class="hide">Используйте "Фильтры" для смены перевода и сезона.<hr><img src="http://lampa.stream/img/guide/open_filter.jpg"></div><div class="hide">Для смены сезона или озвучки воспользуйтесь пунктами<br>1. Перевод<br>2. Сезон<hr><img src="http://lampa.stream/img/guide/filters.jpg"></div><div class="hide">Поздравляем! После прохождения краткого гайда, Вы знаете как пользоваться приложением и у Вас должно возникать меньше вопросов</div></div></div><div class="torrent-checklist__footer"><div class="simple-button selector hide back">Назад</div><div class="simple-button selector next">Начать</div><div class="torrent-checklist__next-step"></div></div></div>';
			Lampa.Template.add('guide', guide);
			var temp = Lampa.Template.get('guide');
			var descr = temp.find('.torrent-checklist__descr');
			var list = temp.find('.torrent-checklist__list > li');
			var info = temp.find('.torrent-checklist__infoS > div');
			var next = temp.find('.torrent-checklist__next-step');
			var prog = temp.find('.torrent-checklist__progress-bar > div');
			var comp = temp.find('.torrent-checklist__progress-steps');
			var btn = temp.find('.next');
			var btn_back = temp.find('.back');
			var position = -2;

			function makeStep(step) {
				step ? position-- : position++;
				var total = list.length;
				comp.text('Пройдено ' + Math.max(0, position) + ' из ' + total);
				if (position > list.length) {
					Lampa.Modal.close();
					Lampa.Controller.toggle('content');
					Lampa.Storage.set('guide', true);
				} else if (position >= 0) {
					Lampa.Storage.set('guide', '');
					info.addClass('hide');
					descr.addClass('hide');
					info.eq(position).removeClass('hide');
					var next_step = list.eq(position + 1);
					prog.css('width', Math.round(position / total * 100) + '%');
					btn.text(position < total ? 'Далее' : 'Завершить');
					if (position > 0) btn_back.removeClass('hide');
					next.text(next_step.length ? '- ' + next_step.text() : '');
				}
			}
			makeStep();
			btn.on('hover:enter', function () {
				makeStep();
			});
			btn_back.on('hover:enter', function () {
				if (position == 1) {
					//	btn_back.removeClass('focus')//.addClass('hide');
					//	btn.addClass('focus');
					//Lampa.Controller.collectionSet() ;
					// Lampa.Controller.collectionFocus(btn);
				}
				if (position > 0) makeStep(true);
			});
			Lampa.Modal.open({
				title: 'Гайд по использованию',
				html: temp,
				size: 'medium',
				mask: true
			});
		}
	}
	if (!window.plugin_modss) startPlugin();
})();
