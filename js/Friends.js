/*!
 * Friends.js
 *
 * Copyright 2012, Leo Hsieh
 * http://www.leoj.net
 *
 * Date: Thu Jul  5 16:26:56 PDT 2012
 */
var Friends = {
  f: [],
  current: 0,
  pageWidth: 300,
  container: $('#container'),
  GRAPH: 'http://graph.facebook.com/',
  navbar: $('#navbar li a'),
  wrapper: $('#wrapper'),
  button: $('#getButton'),
  head: $('#head'),
  loader: $('#loader'),
  gender: $('#gender'),
  male: $('#male h3 em'),
  female: $('#female h3 em'),
  canvasHTML: $('#FB_canvas'),
  login: $('#fb_login'),
  selfTemplate: $('#selfTemplate').html(),
  friendsTemplate: $('#friendsTemplate').html(),
  noticeBoard: $('#noticeBoard'),
  number: $('#number'),
  notice: $('#notice'),
  nav: $('nav'),
  dialogLink: $('#genderRatio'),
  isCanvas: Modernizr.canvas,
  ratio: $('#ratio h1'),
  startSign: $('#startSign'),
  getSign: $('#getSign'),
  checkSign: $('#checkSign'),
  fb: $('#fb_login'),
  x: $(window).width() / 2 - 300 / 2,
  y: $(window).height() / 2 - 350 / 2,

  init: function () {

    // set up page width
    var w = $(window).width() / 2 - Friends.loader.outerWidth() / 2,
      wrapperWindth = $(window).width() / 2 - Friends.wrapper.outerWidth() / 2;

    // set elements hide
    Friends.hideSetting();

    Friends.dialog();

    Friends.loader.css({
      'margin-left': w
    });

    $("input:submit, a, button", ".demo").button();

    Friends.clickEventHandler();
    Friends.jumpHandler();
  },
  dialog: function () {
    // dialog
    $('#dialog').dialog({
      autoOpen: false,
      model: true,
      width: 300,
      height: 280,
      position: [Friends.x, Friends.y],
      buttons: {
        "Ok": function () {
          $(this).dialog("close");
        }
      }
    });


    Friends.dialogLink.on('click', function () {

      if (Friends.isCanvas) {
        Friends.gender.remove();
      } else {
        Friends.canvasHTML.css('display', 'none');
        Friends.gender.show('fast');
      }

      $('#dialog').dialog('open');

      return false;
    });

  },
  hideSetting: function () {
    Friends.isStartSignHidden = Friends.startSign.is(':hidden');
    Friends.isWrapperHidden = Friends.wrapper.is(':hidden');
    Friends.isLoaderHidden = Friends.loader.is(':hidden');
    Friends.isNoticeBoardHidden = Friends.noticeBoard.is(':hidden');
    Friends.isNavHidden = Friends.nav.is(':hidden');
  },
  canvas: function () {

    var canvas = document.getElementById("FB_canvas"),
      context = canvas.getContext("2d"),
      centerX = 95,
      centerY = 37,
      radius = 20;

    // girl
    context.lineWidth = 5;
    context.strokeStyle = "red";

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.moveTo(centerX, centerY + 20);
    context.lineTo(centerX, centerY + 60);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.moveTo(centerX - 30, centerY + 37);
    context.lineTo(centerX + 30, centerY + 37);
    context.stroke();
    context.closePath();

    // boy
    centerX += 80;
    centerY += 40;

    context.lineWidth = 5;
    context.strokeStyle = "blue";

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.moveTo(centerX, centerY - 20);
    context.lineTo(centerX, centerY - 60);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.moveTo(centerX, centerY - 60);
    context.lineTo(centerX - 20, centerY - 35);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.moveTo(centerX, centerY - 60);
    context.lineTo(centerX + 20, centerY - 35);
    context.stroke();
    context.closePath();
  },
  jumpHandler: function () {

    Friends.button.hover(function () {
      // jump 1
      Friends.head.animate({
        top: '127px'
      }, 200).animate({
        top: '142px'
      }, 200)
      // jump 2
      .animate({
        top: '132px'
      }, 100).animate({
        top: '142px'
      }, 100)
      // jump 3
      .animate({
        top: "137px"
      }, 100).animate({
        top: "142px"
      }, 100);

    }, function () {
      Friends.head.stop();
    });
  },
  clickEventHandler: function () {
    Friends.login.on('click', Friends.loginCallback);
    Friends.button.on('click', Friends.start);
    Friends.startSign.on('click', Friends.SignCallback);
  },
  setUp: function () {
    var myInfo = $('#myInfo'),
      friendsInfo = $('#friendsInfo');

    // reset friends counter
    Friends.f = [];

    // hide dialog
    $('#dialog').dialog('close');

    // hide myInfo div if it showed
    if (myInfo.hasOwnProperty('length')) {
      myInfo.css('display', 'none');
    }

    // hide friendsInfo div if it showed
    if (friendsInfo.hasOwnProperty('length')) {
      friendsInfo.css('display', 'none');
    }

    // hide wrapper and dialog button if it showed
    if (Friends.isWrapperHidden) {
      Friends.wrapper.fadeOut('fast');
      Friends.dialogLink.css('display', 'none');
    }

    // hide notice board if it showed
    if (Friends.isNoticeBoardHidden) {
      Friends.noticeBoard.fadeOut('fast');
    }

    // hide function list
    if (Friends.isNavHidden) {
      Friends.nav.fadeOut('fast');
    }

    // show sign
    if (Friends.isStartSignHidden) {
      // Friends.startSign.fadeIn('fast');
    }
  },
  getGender: function () {
    /* gender */
    var query = FB.Data.query('SELECT sex FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())'),
      genderTable = {
        male: 0,
        female: 0
      };

    query.wait(function (row) {
      $.each(row, function (index, val) {
        val.sex === 'male' ? genderTable.male++ : genderTable.female++;
      });

      if (Friends.isCanvas) {
        Friends.ratio.text(genderTable.female.toString() + ' : ' + genderTable.male.toString());
      } else {
        Friends.male.text(genderTable.male.toString());
        Friends.female.text(genderTable.female.toString());
      }

    });
  },
  start: function () {

    FB.getLoginStatus(function (response) {
      if (!response.authResponse) {
        alert('You must log in first!');
        // alert('You are not connected');
        return;
      }

      Friends.setUp();
      // show or hide loader gif
      Friends.getSign.slideUp('fast', function () {
        Friends.checkSign.slideUp('fast');
        !Friends.isLoaderHidden ? Friends.loader.fadeOut('slow') : Friends.loader.fadeIn('slow');
      });

      FB.api("/me", function (result) {

        Friends.self = result.id;

        Friends.getGender();

        if (Friends.isCanvas) {
          Friends.canvas();
        }

        FB.api('/me/feed', function (data) {
          Friends.getScore(data);
        });
      });
    });
  },
  getScore: function (json) {

    // retreive data from FB
    Friends.data = $.map(json.data, function (info) {

      return {
        id: info.id,
        msg: info.message,
        comments: info.comments,
        likes: info.likes,
        from: info.from,
        application: info.application,
        video: info.link,
        source: info.source,
        picture: info.picture,
        msgTag: info.message_tags,
        place: info.place,
        type: info.type,
        with: info.with_tags
      };
    });

    // get my personal info
    Friends.getMyInfo();

    // get my friends info
    Friends.getFriendsInfo();

    Friends.loader.fadeOut('slow', function () {
      Friends.controllerSetting();
      Friends.wrapper.slideDown('slow', function () {
        // show check sign
        Friends.checkSign.slideDown('slow');
      });
      Friends.dialogLink.show('slow');

      // show notice board
      Friends.noticeBoard.fadeIn('slow', function () {
        // show button of function list
        // Friends.nav.css('display', 'block');
        Friends.nav.slideDown('slow');
      });
    });
  },
  loginCallback: function () {
    Friends.setUp();
  },
  controllerSetting: function () {
    Friends.navbar.each(function () {

      var self = $(this),
        myInfo = $('#myInfo'),
        friendsInfo = $('#friendsInfo'),
        isMyInfoHidden = $('#myInfo').is(':hidden'),
        isFriendsInfoHidden = $('#friendsInfo').is(':hidden');


      self.on('click', function () {
        // hide check sign
        Friends.checkSign.fadeOut('slow');

        if (self.data('info') === 'self') {

          // show my info
          if (isMyInfoHidden) {
            myInfo.show('slow');
          }

          // hide my friends info
          if (isFriendsInfoHidden) {
            friendsInfo.slideUp('slow');
          }
        }
        //  && Friends.controller.is(':hidden')
        else if (self.data('info') === 'friends') {

          // hide my info
          if (isMyInfoHidden) {
            myInfo.hide('slow');
          }

          // show my friends info
          if (isFriendsInfoHidden) {
            friendsInfo.slideDown('slow');
          }
        }

        // prevent default operation of browser
        return false;
      });
    });
  },
  getFriendsInfo: function () {

    var d = Friends.data,
      obj = {},
      template,
      val,
      score,
      sort = [],
      o,
      index;

    for (var i = 0; i < d.length; i++) {
      if (d[i].from.id !== Friends.self) {
        if (!obj.hasOwnProperty(d[i].from.id)) {
          obj[d[i].from.id] = {
            name: d[i].from.name,
            post: 1,
            comments: 0,
            likes: 0
          };
        } else {
          obj[d[i].from.id].post++;
        }
      }
      if (d[i].comments) {
        val = d[i].comments.data;
        for (var j = 0; j < val.length; j++) {
          if (val[j].from.id !== Friends.self) {
            if (!obj.hasOwnProperty(val[j].from.id)) {
              obj[val[j].from.id] = {
                name: val[j].from.name,
                post: 0,
                comments: 1,
                likes: 0
              };
            } else {
              obj[val[j].from.id].comments++;
            }
          }
        };
      }
      if (d[i].likes) {
        val = d[i].likes.data;
        for (var j = 0; j < val.length; j++) {
          if (val[j].id !== Friends.self) {
            if (!obj.hasOwnProperty(val[j].id)) {
              obj[val[j].id] = {
                name: val[j].name,
                post: 0,
                comments: 0,
                likes: 1
              };
            } else {
              obj[val[j].id].likes++;
            }
          }
        };
      }
    }
    for (var item in obj) {
      score = obj[item].post * 3 + obj[item].comments * 2 + obj[item].likes * 1;
      obj[item].score = score;
    }

    // create array of object
    for (var item in obj) {
      o = {
        d: item,
        score: obj[item].score,
        name: obj[item].name,
        like: obj[item].likes,
        comment: obj[item].comments,
        post: obj[item].post,
        src: Friends.GRAPH + item + '/picture?type=large'
      };
      if (sort.length === 0) {
        sort.push(o);
      } else {
        index = Friends.findInsertionPoint(obj[item].score, sort)
        sort.splice(index, 0, o);
      }
    }

    // set up notice board
    Friends.number.text(sort.length.toString());
    Friends.notice.text(sort.length.toString() + ' friends responsed on your wall recently');

    template = Handlebars.compile(Friends.friendsTemplate);
    Friends.wrapper.append(template(sort));
  },
  comparator: function (v1, v2) {
    if (v1 > v2) {
      return 1;
    } else {
      return -1;
    }
    return 0;
  },
  findInsertionPoint: function (target, arr) {

    var low = 0,
      high = arr.length - 1,
      mid = -1,
      c = 0;

    while (low <= high) {
      mid = Math.floor((low + high) / 2);
      c = Friends.comparator(target, arr[mid].score);
      if (c === 0) {
        return mid;
      } else if (c < 0) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return low;
  },
  myPlace: function (obj) {

    var placeURL, placeName, at, placeFlag;

    if (obj) {
      placeURL = 'http://www.facebook.com/pages/' + obj.name.replace(/ /g, "-") + '/' + obj.id;
      placeName = obj.name;
      at = ' - at ';
      placeFlag = true;
    } else {
      placeURL = null;
      placeName = null;
      at = null;
      placeFlag = false;
    }

    return {
      at: at,
      placeURL: placeURL,
      placeName: placeName
    };
  },
  withMyFriends: function (obj) {

    var withTag, comma, withFriends, withFriends = [];

    if (obj) {
      withTag = ' - with ';
      for (var i = 0; i < obj.data.length; i++) {

        comma = i != obj.data.length - 1 ? ',' : null;

        withFriends.push({
          name: obj.data[i].name,
          href: 'http://www.facebook.com/' + obj.data[i].id,
          comma: comma
        });
      }
    } else {
      withTag = null;
      withFriends = [];
    }

    return {
      withTag: withTag,
      withFriends: withFriends
    };
  },
  myTags: function (obj, msg) {

    var num, msgFlag, reg, rep, msgTag = [];

    if (obj === undefined) {
      num = null;
      msgFlag = false;
    } else {
      msgFlag = true;
      for (var item in obj) {
        reg = new RegExp(obj[item][0].name);
        rep = '<a target="_blank" href="http://www.facebook.com/' + obj[item][0].id + '">' + obj[item][0].name + '</a>';
        msg = msg.replace(reg, rep);

        msgTag.push({
          msg: msg,
          name: obj[item][0].name,
          href: 'http://www.facebook.com/' + obj[item][0].id
        });
      }
      num = msgTag.length;

      Handlebars.registerHelper('reg_msg', function (msgTag) {
        var result = '<span>' + this.msg + '</span>';
        return new Handlebars.SafeString(result);
      });
    }

    return {
      num: num,
      msgTag: msgTag,
      msg: msg,
      msgFlag: msgFlag
    };
  },
  getMyInfo: function () {

    var like, comment, picture, video, template, my_template, my_obj, myPlaceObj, withMyFriendsObj, myTagsObj;


    my_template = $.grep(Friends.data, function (obj, index) {
      return obj.from.id === Friends.self;
    });

    my_obj = $.map(my_template, function (obj) {

      msg = obj.msg;

      like = obj.likes === undefined ? 0 : obj.likes.count;
      comment = obj.comments === undefined ? 0 : obj.comments.data.length;

      if (obj.source) {
        // it is shared link
        picture = null;
        video = obj.video;
      } else {
        // normal post
        video = null;
        picture = obj.picture === undefined ? null : obj.picture;
      }

      myTagsObj = Friends.myTags(obj.msgTag, msg);

      if (myTagsObj.msgFlag) {
        msg = myTagsObj.msg;
      }

      myPlaceObj = Friends.myPlace(obj.place);

      withMyFriendsObj = Friends.withMyFriends(obj.with);

      if (obj.msg !== undefined) {
        return {
          msg: msg,
          like: like,
          comment: comment,
          video: video,
          picture: picture,
          num: myTagsObj.num,
          tag: myTagsObj.msgTag,
          msgFlag: myTagsObj.msgFlag,
          place: myPlaceObj,
          withObj: withMyFriendsObj
        };
      }
    });

    template = Handlebars.compile(Friends.selfTemplate);
    Friends.wrapper.append(template(my_obj));
  },
};