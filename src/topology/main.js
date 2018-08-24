var nodes = [{
                "name": "Core switching machine",
                "type": "coreswitch",
                "id": "id0"
            },
            {
                "name": "new node",
                "type": "coreswitch",
                "id": "id23"
            },
            {
                "name": "Term 1-1",
                "type": "switch",
                "id": "id1"
            },
            {
                "name": "Term 1-2",
                "type": "switch",
                "id": "id2"
            },
            {
                "name": "Term 1-3",
                "type": "router",
                "id": "id3"
            },
            {
                "name": "Term 1-4",
                "type": "router",
                "id": "id4"
            },
            {
                "name": "Term 1-5",
                "type": "switch",
                "id": "id5"
            },
            {
                "name": "Term 1-6",
                "type": "router",
                "id": "id6"
            },
            {
                "name": "Term 1-1-1",
                "type": "switch",
                "id": "id7"
            },
            {
                "name": "Term 1-1-2",
                "type": "switch",
                "id": "id8"
            },
            {
                "name": "Term 1-2-1",
                "type": "router",
                "id": "id9"
            },
            {
                "name": "Term 1-2-2",
                "type": "switch",
                "id": "id10"
            },
            {
                "name": "Term 1-2-3",
                "type": "router",
                "id": "id11"
            },
            {
                "name": "Term 1-5-1",
                "type": "switch",
                "id": "id12"
            },
            {
                "name": "Term 1-5-2",
                "type": "router",
                "id": "id13"
            },
            {
                "name": "Term 1-1-1-1",
                "type": "router",
                "id": "id14"
            },
            {
                "name": "Term 1-1-1-2",
                "type": "router",
                "id": "id15"
            },
            {
                "name": "Term 1-1-1-3",
                "type": "router",
                "id": "id16"
            },
            {
                "name": "Term 1-1-1-4",
                "type": "router",
                "id": "id17"
            },
            {
                "name": "Term 1-1-2-1",
                "type": "router",
                "id": "id18"
            },
            {
                "name": "Term 1-1-2-2",
                "type": "router",
                "id": "id19"
            },
            {
                "name": "Term 1-2-2-1",
                "type": "switch",
                "id": "id20"
            },
            {
                "name": "Term 1-5-1-1",
                "type": "router",
                "id": "id21"
            },
            {
                "name": "Term 1-5-1-2",
                "type": "router",
                "id": "id22"
            },
            {
                "name": "New Term 1",
                "type": "router",
                "id": "id24"
            }
];


var toline = [{
                "from": "id14",
                "to": "id7"
            },
            {
                "from": "id15",
                "to": "id7"
            },
            {
                "from": "id16",
                "to": "id7"
            },
            {
                "from": "id17",
                "to": "id7"
            },
            {
                "from": "id7",
                "to": "id1"
            },
            {
                "from": "id18",
                "to": "id8"
            },
            {
                "from": "id19",
                "to": "id8"
            },
            {
                "from": "id8",
                "to": "id1"
            },
            {
                "from": "id1",
                "to": "id0"
            },
            {
                "from": "id9",
                "to": "id2"
            },
            {
                "from": "id20",
                "to": "id10"
            },
            {
                "from": "id10",
                "to": "id2"
            },
            {
                "from": "id11",
                "to": "id2"
            },
            {
                "from": "id2",
                "to": "id0"
            },
            {
                "from": "id3",
                "to": "id0"
            },
            {
                "from": "id4",
                "to": "id0"
            },
            {
                "from": "id22",
                "to": "id12"
            },
            {
                "from": "id12",
                "to": "id5"
            },
            {
                "from": "id13",
                "to": "id5"
            },
            {
                "from": "id5",
                "to": "id0"
            },
            {
                "from": "id21",
                "to": "id12"
            },
            {
                "from": "id6",
                "to": "id0"
            },
            {
                "from": "id24",
                "to": "id23"
            }
];


console.log(mTopo);


var networkTopo = new mTopo(document.getElementById("myTopo"));

var imgResource = ["/src/images/coreswitch.png", "/src/images/switch.png", "/src/images/router.png"];




networkTopo.load(imgResource, function(res) {

    var nodeList = new Object();

    for (var k = 0; k < nodes.length; k++) {
        var item = networkTopo.addNode(nodes[k].id, nodes[k].name, res[imgResource.indexOf("/src/images/" + nodes[k].type + ".png")]);




        if (nodes[k].type === "coreswitch") {
            networkTopo.setRoot(item);
            item.width = 42;
            item.height = 50;
            item.textOffsetY = 50;
        } else {
            item.width = 50;
            item.height = 40;
            item.textOffsetY = 40;
        }

        //if(nodes[k].id === "id14") networkTopo.setVisible(item,1);

        item.type = nodes[k].type;

        item.totalFrames = 3;
        item.logicUpDate = true;

        item.gotoAndStop(Math.floor(Math.random() * 3));

        nodeList[nodes[k].id] = item;




    }

    //console.log(nodeList);

    for (var k = 0; k < toline.length; k++) {
        //console.log(toline[k]['from'],nodeList[toline[k]['from']]);
        networkTopo.addLink(nodeList[toline[k]['from']], nodeList[toline[k]['to']]);
    }

    console.log(networkTopo);
    networkTopo.init({
        scale: 1,
        translateX: 0,
        translateY: 0,
        tooltip: true,
        orient: "vertical", // 树的方向可选：'vertical' | 'horizontal' | 'radial'
        lineStyle: {
            type: "curve", // 线条类型，可选为：'curve'（曲线） | 'line'（直线）
            color: "#999",
            width: 1,
        },
        distanceX: 100,
        distanceY: 120,
        textStyle: {
            align: "center",
            color: "#333",
            font: "14px Helvetica",
        }
    });


    networkTopo.on("click", function(e) {
        console.log(e.target.id);
    });




    document.getElementById("TopoImage").onclick = function() {
        window.open(networkTopo.getImage());
    };
    var topolink = document.getElementById("TopoLink"),
        linking = false;
    topolink.onclick = function() {
        if (linking) {
            networkTopo.stopLink();
            topolink.style.color = "#ddd";
            linking = false;
        } else {
            console.log(networkTopo);
            topolink.style.color = "#5bbd72";
            networkTopo.startLink(function(e1, e2) {
                alert(e1.id + " " + e2.id);
            });
            linking = true;
        }

    };

})
