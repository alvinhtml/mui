

    //交换机面板

    var switchTopo = new mTopo(document.getElementById("switch"));

    switchTopo.load(["/src/images/port.png","/src/images/term.png","/src/images/logo_huawei.png"],function(res){

        var portNode = [];

        for (var e = 1; e < 12; e++) {
            portNode.push({
                "name": "Alvin-PC" + e,
                "type": "term",
                "id": "term0" + e
            });
        }

        var switchLink = [{
            "from": "term01",
            "to": "id5"
        }, {
            "from": "term02",
            "to": "id8"
        }, {
            "from": "term03",
            "to": "id14"
        }, {
            "from": "term04",
            "to": "id21"
        }, {
            "from": "term05",
            "to": "id16"
        }, {
            "from": "term06",
            "to": "id18"
        }, {
            "from": "term07",
            "to": "id37"
        }, {
            "from": "term08",
            "to": "id24"
        }, {
            "from": "term09",
            "to": "id29"
        }, {
            "from": "term010",
            "to": "id20"
        }, {
            "from": "term011",
            "to": "id41"
        }]


        var switchDate = [{
            "module": "0",
            "rabbets": [{
                "rabbet": "1",
                "ports": []
            }]
        }]

        for (var e = 1; e < 52; e++) {
            switchDate[0].rabbets[0].ports.push({
                "name":e,
                "iname":"GigabitEthernet0/"+e,
                "type": "port",
                "online": Math.floor(Math.random()*2),
                "adminstate": Math.floor(Math.random()*2),
                "uplink": Math.floor(Math.random()*2),
                "id": "id" + e
            });
        }



       /* for (var e1 = 1; e1 < 8; e1++) {
            switchDate[1].rabbets[0].ports.push({
                "name": e1,
                "type": "port",
                "id": "id" + (e1 + 56)
            });
        }

        for (var e2 = 1; e2 < 48; e2++) {
            switchDate[1].rabbets[1].ports.push({
                "name": e2,
                "type": "port",
                "id": "id" + (e2 + 56 + 8)
            });
        } */


        var portColor = ["#aaa19c", "#aaa19c", "#e4ff00", "#f7a303", "ffa800", "#14b823"];

        var nlist = new Object(),
            module, rabbet;

        for (var im = 0; im < switchDate.length; im++) {

            module = switchDate[im];

            for (var ir = 0; ir < module.rabbets.length; ir++) {

                rabbet = module.rabbets[ir]

                for (var ip = 0; ip < rabbet.ports.length; ip++) {

                    var node = rabbet.ports[ip];

                    if (node.type === "term") {

                    } else {
                        var item = switchTopo.addNode(node.id, node.name, res[0]);
                        item.type = "port";
                        item.width = 30;
                        item.height = 34;
                        item.module = module.module;
                        item.rabbet = rabbet.rabbet;
                        var random = Math.floor(Math.random() * 6);

                        item.iname = node.iname;
                        item.online = node.online===1?'<span class="text-green">在线</span>':'<span class="text-red">离线</span>';
                        item.adminstate = node.adminstate===1?'<span class="text-green">开启</span>':'<span class="text-red">关闭</span>';
                        item.uplink = node.uplink===1?'<span class="text-green">级联</span>':'<span>普通</span>';
                        item.term_num = Math.floor(Math.random() * 200) + 3;


                        item.color = portColor[random];

                        item.gotoAndStop(random);

                        //item.totalFrames = 8;
                    }

                    nlist[node.id] = item;
                }
            }
        }

        var termColor = ["#67809f", "#ff0000", "#bbbbbb"];

       for (var i = portNode.length; i--;) {
            var item = switchTopo.addNode(portNode[i].id, portNode[i].name,res[1]);
            item.type = "term";
            item.width = 32;
            item.height = 30;
            //item.color = termColor[Math.floor(Math.random() * 3)];
            item.gotoAndStop(Math.floor(Math.random() * 3));
            console.log(item.color);
            item.textOffsetY = 25;
            item.totalFrames = 1;
            item.isDrag = true;
            item.termnum = Math.floor(Math.random() * 200) + 3;

            //item.blend="lighter";
            //item.play();

            nlist[portNode[i].id] = item;
        }


        //console.log(nlist);

        for (var k = 0; k < switchLink.length; k++) {
            //console.log(switchLink[k]['from'],nlist[switchLink[k]['from']]);
           switchTopo.addLink(nlist[switchLink[k]['to']], nlist[switchLink[k]['from']]);
        }


        var upArr = [], downArr = [];

        for(var i=60; i--;){
            upArr.push(Math.floor(Math.random() * 100));
            downArr.push(Math.floor(Math.random() * 100));
        }

/*        console.log(upArr);
        console.log(Math.max.apply(null, upArr));

        console.log(downArr);
        console.log(Math.max.apply(null, downArr));*/



        // console.log(switchTopo);
        switchTopo.init({
            scale: 1,
            translateX: 0,
            translateY: 0,
            type: 'switch',
            data: {
                cpu: 30,
                mem: 70,
                flow: {
                    up: upArr,
                    down: downArr,
                    allup: "3.45G",
                    alldown: "78.43G",
                },
                info: {
                    name: "Hangzhou_H3C-AB:24:3C",
                    mac: "3C:8C:40:AB:24:3C",
                    ip: "192.168.10.233",
                    runtime: "3天17小时52分",
                    updatetime: "2016-06-03 18:01:26",
                    status: "正常",
                    sysname: 'sysname',
                    snmpvendor: res[2],
                    snmpdesp:"H3C Switch S5120-28P-LI Software Version 5.20, Release 1513P62  Copyright(c) 2004-2013 Hangzhou H3C Tech. Co., Ltd. All rights reserved.",
                    snmpmodule: "C3560",
                    opstate: 0
                }
            },
            tooltip: function(target) {
                var titleDom="";
                switch(target.type){
                    case "cpu":
                    titleDom = "CPU使用率：" + target.data + "%";
                    break;
                    case "mem":
                    titleDom = "内存使用率：" + target.data + "%";;
                    break;
                    case "flow":
                    titleDom = "最近1小时使用率";
                    break;
                    case "vendor":
                    titleDom = '<span style="white-space: normal;">' + target.data.snmpdesp + '</span>';
                    break;
                     case "title":
                    titleDom = ('<span class="text-orange">' + target.data.name + '</span><br/>'
                            + 'MAC：' + target.data.mac + '<br/>'
                            + 'IP：' + target.data.ip + '<br/>'
                            + '过期时间：' + target.data.runtime + '<br/>');
                    break;
                    case "port":
                    titleDom = (target.iname + '<br/>'
                            + '管理状态：' + target.adminstate + '<br/>'
                            + '在线状态：' + target.online + '<br/>'
                            + '终端数量：' + target.term_num + '<br/>'
                            + '链接状态：' + target.uplink);
                    break;
                    case "term":
                    titleDom = target.name;
                    break;
                    default:
                    titleDom = target.name;
                    break;
                }


                return titleDom;
            },
            orient: "vertical", // 树的方向可选：'vertical' | 'horizontal' | 'radial'
            lineStyle: {
                 type: "line", // 线条类型，可选为：'curve'（曲线） | 'line'（直线）
                color: "#00ff00",
                width: 1,
            },
            distanceX: 120,
            distanceY: 150,
            textStyle: {
                align: "center",
                color: "#666",
                 font: "12px Tahoma, Geneva, sans-serif"
            }
        });


        document.getElementById("TopoImage").onclick = function() {
            window.open(switchTopo.getImage());
        };

    });
