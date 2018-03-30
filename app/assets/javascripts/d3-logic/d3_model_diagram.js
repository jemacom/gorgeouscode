if (typeof model_diagram_json !== "undefined") {
  var model_diagram_json_orig = prepareData(model_diagram_json);
}

function prepareData(data) {
  data["models"].nodes.forEach((node) => {

    node.orig_name = JSON.parse(JSON.stringify(node.name.replace('::', '')));
    node.name = node.name.replace(/_/g, '::');
  });

  return JSON.parse(JSON.stringify(data));
}

const ELIPSE_WIDTH_FACTOR = 5,
  RECT_WIDTH_FACTOR = 3,
  EXPANDED_TOP_PADDING = -10,
  TYPE_COLORS = [
    ['Integer', 'blue'],
    ['Boolean', 'darkGreen'],
    ['Float', 'darkBlue'],
    ['String', 'brown'],
    ['Json', 'green'],
    ['Datetime', 'darkOrange']
  ];

var width = 780,
  height = 400;

var zoom;

var linkDistance = 300,
  padding = 1000,
  charge = -8000,
  gravity = .3,
  friction = .6,
  linkStrength = 1,
  chargeDistance = 1000;

var nodes = {};
var svg;

var nodes_temp;

var savedGraph = {
  nodes: []
};

d3.select("#saveBtn").on('click', function () {
  savedGraph.nodes = nodes_temp;
  svg.selectAll("*").remove();
});

d3.select("#loadBtn").on('click', function () {
  var loadedGraph = {
    nodes: [],
    links: []
  };
  loadedGraph.nodes = savedGraph.nodes;
  loadedGraph.links = JSON.parse(JSON.stringify(model_diagram_json_orig))["models"].links;
  draw(loadedGraph);
});

d3.select("#release").on('click', function () {
  force.nodes().forEach(function (d) {
    d.fixed = false;
  });
});

var force = d3.layout.force()
  .charge(charge)
  .gravity(gravity)
  .friction(friction)
  .linkStrength(linkStrength)
  .chargeDistance(chargeDistance)
  .linkDistance(linkDistance)
  .size([width, height]);


if (typeof model_diagram_json !== "undefined") {
  var graph = {
    nodes: [],
    links: []
  };
  graph.nodes = model_diagram_json["models"].nodes;
  graph.links = model_diagram_json["models"].links;
  draw(graph);
}

function draw(graph) {

  console.log(graph);

  function zoomed() {
    viz.attr("transform",
      "translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")");
  };

  function linkDoubleClicked(link) {
    linkPath = d3.select(this)[0][0];
    linkText = $("#text" + linkPath.id);
    if (linkText.is(":visible")) {
      linkText.css("display", "none");
    } else {
      linkText.css("display", "inline");
    }
  }

  function clickGitSource(node) {
    var github_path = "http://github.com/freeletics/core-user-rails";
    var names = node.name.split(/_/g);
    console.log(names);
    names.forEach((name) => {
      github_path += "/" + name.toLowerCase();
    })

    //window.open('http://www.sapo.pt');
  }

  function drawEntireNodeExpanded(nodePathShape, maxLengthAttribute, node) {

    var expWidth = expandedWidth(maxLengthAttribute),

      numberOfAttributes = node.attributes.length;
    // inside node
    d3.select(nodePathShape)
      .attr('d', function (d) {
        switch (d.shapetype) {
          case 'Mrecord':
            return drawNodeExpandedRoundedRect(numberOfAttributes, expWidth, 10);
            break;
          case 'record':
            return drawNodeExpandedRect(numberOfAttributes, expWidth);
            break;
          default:
            return drawNodeExpandedRect(numberOfAttributes, expWidth);
            break;
        }
      });

    /* TABS START */
    showAttributes();
    // ATTRIBUTES
    console.log(node);
    d3.select(nodePathShape.parentNode)
      .classed('tab-1', true)
      .append('svg')
      .classed('tab', true)
      .classed(node.orig_name + 'Tabs', true)
      .on('click', function () {
        setTabActive(this);
        showAttributes();
      })
      .attr('x', 4 - expWidth)
      .attr("y", 5)
      .append('use')
      .attr('xlink:href', '#tab-shape')
      .attr('transform', 'scale(0.55, 0.4)');


    d3.select(nodePathShape.parentNode)
      .append('text')
      .attr('class', node.orig_name + 'Tabs')
      .attr("y", 16)
      .attr('text-anchor', 'left')
      .attr('x', 4 - expWidth + 5)
      .attr('font-size', 8)
      .attr('font-family', 'sans-serif')
      .attr('fill', "white")
      .text(function (d) {
        return "Attribute";
      })

    d3.select(nodePathShape.parentNode)
      .classed('tab-2', true)
      .append('svg')
      .classed('tab', true)
      .classed(node.orig_name + 'Tabs', true)
      .on('click', function () {
        setTabActive(this);
        showDescription();
      })
      .attr('x', -expWidth + 63)
      .attr("y", 5)
      .append('use')
      .attr('xlink:href', '#tab-shape')
      .attr('transform', 'scale(0.65, 0.4)');


    d3.select(nodePathShape.parentNode)
      .append('text')
      .attr('class', node.orig_name + 'Tabs')
      .attr("y", 16)
      .attr('text-anchor', 'left')
      .attr('x', -expWidth + 63 + 5)
      .attr('font-size', 8)
      .attr('font-family', 'sans-serif')
      .attr('fill', "white")
      .text(function (d) {
        return "Description";
      })


    d3.select(nodePathShape.parentNode)
      .classed('tab-2', true)
      .append('svg')
      .classed('tab', true)
      .classed(node.orig_name + 'Tabs', true)
      .on('click', function () {
        setTabActive(this);
        showDescription();
      })
      .attr('x', -expWidth + 63 + 70)
      .attr("y", 5)
      .append('use')
      .attr('xlink:href', '#tab-shape')
      .attr('transform', 'scale(0.45, 0.4)');


    d3.select(nodePathShape.parentNode)
      .append('text')
      .attr('class', node.orig_name + 'Tabs')
      .attr("y", 16)
      .attr('text-anchor', 'left')
      .attr('x', -expWidth + 63 + 70 + 5)
      .attr('font-size', 8)
      .attr('font-family', 'sans-serif')
      .attr('fill', "white")
      .text(function (d) {
        return "Methods";
      })


    function setTabActive(d) {
      console.log("alles zurücksetzen");
      d3.select(d.parentNode).selectAll('.tab').style("fill", 'url(#tab-2-bg)');
      d3.select(d).style("fill", 'url(#tab-4-bg)');
    }

    function removeAttributeText() {
      d3.select(nodePathShape.parentNode).selectAll("." + node.orig_name + 'AttributeText').remove();
    }

    function removeDescriptionText() {
      d3.select(nodePathShape.parentNode).selectAll("." + node.orig_name + 'DescriptionText').remove();
    }

    /* TABS END */

    function showAttributes() {

      removeDescriptionText();

      maxLengthAttributeTypes = getMaxLengthAttributeTypes(node);

      for (i = 0; i < numberOfAttributes; i++) {
        d3.select(nodePathShape.parentNode)
          .append('text')
          .attr('class', node.orig_name + 'AttributeText')
          .attr("dy", (i + 1) * 20 + 10)
          .attr('text-anchor', 'left')
          .attr('x', 5 - expWidth)
          .attr('font-size', 8)
          .attr('font-family', 'sans-serif')
          .attr('fill', node.fontcolor)
          .text(function (d) {
            return d.attributes[i][0];
          });

        d3.select(nodePathShape.parentNode)
          .append("text")
          .attr("class", node.orig_name + "AttributeText")
          .attr("dy", (i + 1) * 20 + 10)
          .attr("text-anchor", "right")
          .attr('fill', function (d) {

            for (var it = 0, l = TYPE_COLORS.length; it < l; it++) {
              if (d.attributes[i][1] == TYPE_COLORS[it][0]) {
                return TYPE_COLORS[it][1];
              }
            }
          })
          .attr("font-size", 8)
          .attr("font-family", "sans-serif")

          .text(function (d) {
            return " :: " + d.attributes[i][1];
          })
          .attr("x", function (d) {
            return expWidth - (maxLengthAttributeTypes * 6);
          });

      }
    }


    function showDescription() {

      removeAttributeText();

      d3.select(nodePathShape.parentNode)
        .append('text')
        .attr('class', node.orig_name + 'DescriptionText')
        .attr("dy", 30)
        .attr('text-anchor', 'left')
        .attr('x', 5 - expWidth)
        .attr('font-size', 8)
        .attr('font-family', 'sans-serif')
        .attr('fill', node.fontcolor)
        .text(function (d) {
          console.log(d);
          if (d.description.length > 0) {
            return d.description;
          }
          return "Keine Beschreibung vorhanden";
        });

    }
  }

  function getShapeHeight(nodePathShape) {
    var element = d3.select(nodePathShape)[0][0],
      elementPath = element.getAttribute('d');

    return parseFloat(/[0-9]+\sZ/.exec(elementPath)[0].replace(' Z', ''));
  }

  function getMaxLengthAttribute(node) {

    var numberOfAttributes = node.attributes.length,
      maxNameLength = getMaxLengthAttributeNames(node),
      maxAttributeLength = getMaxLengthAttributeTypes(node);

    var lengthTogether = maxNameLength + maxAttributeLength;

    if (node.name.length > lengthTogether) {
      return node.name.length;
    } else {
      return lengthTogether;
    }

  }

  function getMaxLengthAttributeNames(node) {

    var numberOfAttributes = node.attributes.length,
      maxLengthAttribute = 0;

    for (i = 0; i < numberOfAttributes; i++) {

      var currentNodeLength = node.attributes[i][0].length;

      if (currentNodeLength > maxLengthAttribute) {
        maxLengthAttribute = currentNodeLength;
      }
    }

    if (node.name.length > maxLengthAttribute) {
      return node.name.length;
    } else {
      return maxLengthAttribute;
    }
  }

  function getMaxLengthAttributeTypes(node) {

    var numberOfAttributes = node.attributes.length,
      maxLengthAttribute = 0;


    for (i = 0; i < numberOfAttributes; i++) {

      var currentNodeLength = node.attributes[i][1].length;

      if (currentNodeLength > maxLengthAttribute) {
        maxLengthAttribute = currentNodeLength;
      }
    }


    if (node.name.length > maxLengthAttribute) {
      return node.name.length;
    } else {
      return maxLengthAttribute;
    }
  }

  function minimizeNode(node, nodePathShape) {
    d3.select(nodePathShape).attr('d', node.shape);
    $("div#model-diagram-info").empty().append("<p style='display: inline-block; padding-right: 5px;' class='text-muted'>Model information</p>");
    $('text.' + node.orig_name + "AttributeText").remove();
    $('text.' + node.orig_name + "DescriptionText").remove();
    $('.' + node.orig_name + 'Tabs').remove();
    $("rect.node-git-link").remove();
    $("rect." + node.orig_name + "AttributeBackground").remove();

    node.expanded = false;
  }

  function nodeDoubleClicked(node) {
    // node refers node object
    // this refers to node path shape
    if (d3.event.defaultPrevented) return; // dragged

    if (node.attributes !== null) {

      var numberOfAttributes = node.attributes.length;
      var maxLengthAttribute = getMaxLengthAttribute(node);

      $("div#model-diagram-info").empty();

      node.expanded = true;

      if ($("text." + node.orig_name + "AttributeText").length < 1) {
        console.log("ausklappen");

        var n = $(this).parent();
        n.parent().append(n.detach());

        drawEntireNodeExpanded(this, maxLengthAttribute, node);

        shapeHeight = getShapeHeight(this);

      } else {

        console.log("einklappen");

        minimizeNode(node, this);
      }
    } else {
      $("div#model-diagram-info").empty().append("<p style='display: inline-block; padding-right: 5px;'>No attributes for " + node.orig_name + "</p>");
    }
  }

  function tickEnd() {
    savedgraph = nodes;
  }

  zoom = d3.behavior.zoom()
    .scaleExtent([0, 10])
    .on("zoom", zoomed);
  // Compute the distinct nodes from the links.
  links = graph.links;

  nodes = {};

  graph.nodes.forEach(function (single_node) {

    var nodeShape = "";
    var shapeType = "";
    var nodeNameLength = single_node.name.length;

    var temp_shape = "";

    if (!single_node.shapetype && single_node.shape) {
      // First load
      temp_shape = single_node.shape;
    } else if (single_node.shape && single_node.shapetype) {
      temp_shape = single_node.shapetype;
    }

    if (temp_shape == "Mrecord") {
      nodeShape = drawNodeElipse(nodeNameLength);
      shapeType = "Mrecord";
    } else if (temp_shape == "record") {
      nodeShape = drawNodeRect(nodeNameLength);
      shapeType = "record";
    } else {
      nodeShape = drawNodeRect(nodeNameLength);
      shapeType = "other";
    }

    // SET DEFAULT VALUE
    var expanded;
    if (single_node.expanded) {
      expanded = single_node.expanded;
    } else {
      expanded = false;
    }

    nodes[single_node.name] = {
      name: single_node.name,
      orig_name: single_node.orig_name,
      description: single_node.description,
      attributes: single_node.attributes,
      expanded: expanded,
      fillcolor: single_node.fillcolor,
      fontcolor: single_node.fontcolor,
      shape: nodeShape,
      shapetype: shapeType
      // new attributes
    };

    if (single_node.px && single_node.py && single_node.x && single_node.y) {
      // If position exists
      nodes[single_node.name].px = single_node.px;
      nodes[single_node.name].py = single_node.py;

      nodes[single_node.name].x = single_node.x;
      nodes[single_node.name].y = single_node.y;

      nodes[single_node.name].fixed = single_node.fixed;
    }

    if (single_node.attributes == single_node.fillcolor == single_node.fontcolor == null) {
      nodes[single_node.name].fillcolor = "#FFF";
      nodes[single_node.name].fontcolor = "#000";
    } else if (single_node.fillcolor == null) {
      nodes[single_node.name].fillcolor = "#DDD";
      nodes[single_node.name].fontcolor = "#000";
    }
  });

  links.forEach(function (link) {
    link.source = nodes[link.source] ||
      (nodes[link.source] = {
        name: link.source,
        fillcolor: "#FFF",
        fontcolor: "#000",
        attributes: null,
        shape: drawNodeRect(link.source.length)
      });
    link.target = nodes[link.target] ||
      (nodes[link.target] = {
        name: link.target,
        fillcolor: "#FFF",
        fontcolor: "#000",
        attributes: null,
        shape: drawNodeRect(link.target.length)
      });
  });

  force.nodes(d3.values(nodes))
    .links(links)
    .on('tick', tick)
    .on('end', tickEnd)
    .start();
  //.chargeDistance(chargeDistance)

  var output = [];

  for (var type in nodes) {

    if (isNode(nodes[type])) {
      output.push(nodes[type]);
    }
  }

  nodes_temp = output;

  function isNode(n) {
    var result = false;

    model_diagram_json_orig["models"].nodes.forEach((node) => {
      if (n.name == node.name) {
        result = true;
      }
    })

    return result;
  }

  function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.selectAll('.node').classed("fixed", d.fixed = true);
  }

  var drag = force.drag()
    .origin(function (d) {
      return d;
    })
    .on("dragstart", dragstarted);

  d3.select("div#svg-model-diagram div").remove();
  svg =
    d3.select("div#svg-model-diagram")
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .call(zoom)
    .on("dblclick.zoom", null)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 600 400")
    //class to make it responsive
    .classed("svg-content-responsive", true);

  var viz =
    svg.append('g')
    .attr('id', 'viz');


  function helpToggle() {
    $('svg > image.help-image').toggleClass('no-opacity');
    $('svg > g > rect.help-btn').toggleClass('inactive-help-btn');
  }

  path = '/assets/gc-help.png'
  var gcHelpImg = svg.selectAll('image').data([0]);
  gcHelpImg.enter()
    .append('svg:image')
    .attr('xlink:href', path)
    .classed('help-image', true)
    .attr('x', '0')
    .attr('y', '30')
    .attr('width', '170')
    .attr('height', '170')

  var helpBtn =
    svg.append('g')
    .attr('id', 'help-btn-group')
    .attr('transform', 'translate(45,10)');

  helpBtn.append('rect')
    .classed('help-btn', true)
    .attr('width', '31')
    .attr('height', '7')
    .style('fill', 'lightGray')
    .style('stroke-width', 0.3)
    .style('stroke', 'darkGreen')
    .attr("float", "left")
    .on("dblclick", helpToggle);

  helpBtn.append('text')
    .classed('help-btn-text', true)
    .attr('x', 3)
    .attr('y', 5)
    .style('fill', 'black')
    .style('font-size', '5px')
    .attr("font-family", "Verdana, Helvetica, sans-serif")
    .text('Help toggle');

  // build the stub
  viz.append("viz:defs")
    .selectAll("marker")
    .data(["stub"]) // Different link/path types can be defined here
    .enter().append("viz:marker") // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "-1 -5 2 10")
    .attr("refX", 17)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("viz:path")
    .attr("d", drawStub);

  // build the diamond (ex-crow)
  viz.append("viz:defs")
    .selectAll("marker")
    .data(["crow"]) // Different link/path types can be defined here
    .enter().append("viz:marker") // This section adds in the marker
    .attr("id", String)
    .attr("viewBox", "-10 -6 20 12")
    .attr("refX", 30)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .attr('fill', '#7B0000')
    .append("viz:path")
    .attr("d", drawDiamond);

  // build the light gray single_arrow
  viz.append("viz:defs")
    .selectAll("marker")
    .data(["single_arrow_light_gray"])
    .enter().append("viz:marker")
    .attr("id", String)
    .attr("viewBox", "-5 -5 20 30")
    .attr("refX", 25)
    .attr("refY", 0)
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("orient", "auto")
    .append("viz:path")
    .attr("d", drawSingleArrow)
    .attr("fill", "#BBB");

  // build the blue double_arrow
  viz.append("viz:defs")
    .selectAll("marker")
    .data(["double_arrow_blue"])
    .enter().append("viz:marker")
    .attr("id", String)
    .attr("viewBox", "-5 -5 20 30")
    .attr("refX", 35)
    .attr("refY", 0)
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("orient", "auto")
    .append("viz:path")
    .attr("d", drawDoubleArrow)
    .attr("fill", "#1c7a9b");

  // build the green double_arrow
  viz.append("viz:defs")
    .selectAll("marker")
    .data(["double_arrow_green"])
    .enter().append("viz:marker")
    .attr("id", String)
    .attr("viewBox", "-5 -5 20 30")
    .attr("refX", 35)
    .attr("refY", 0)
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("orient", "auto")
    .append("viz:path")
    .attr("d", drawDoubleArrow)
    .attr("fill", "#789e2d");

  // build the green double_arrow_backwards
  viz.append("viz:defs")
    .selectAll("marker")
    .data(["double_arrow_backwards_green"])
    .enter().append("viz:marker")
    .attr("id", String)
    .attr("viewBox", "-5 -5 20 30")
    .attr("refX", -20)
    .attr("refY", 0)
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("orient", "auto")
    .append("viz:path")
    .attr("d", drawDoubleArrowBackwards)
    .attr("fill", "#789e2d");

  // build the blue triple_arrow
  viz.append("viz:defs")
    .selectAll("marker")
    .data(["triple_arrow_blue"])
    .enter().append("viz:marker")
    .attr("id", String)
    .attr("viewBox", "-5 -5 20 45")
    .attr("refX", 43)
    .attr("refY", 0)
    .attr("markerWidth", 17)
    .attr("markerHeight", 17)
    .attr("orient", "auto")
    .append("viz:path")
    .attr("d", drawTripleArrow)
    .attr("fill", "#1c7a9b");

  // build the light gray dot
  viz.append("viz:defs")
    .selectAll("marker")
    .data(["dot_light_gray"])
    .enter().append("viz:marker")
    .attr("id", String)
    .attr("viewBox", "-5 -5 10 10")
    .attr("refX", -13)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("viz:path")
    .attr("d", drawDot)
    .attr("fill", "#BBB");

  // build the blue dot
  viz.append("viz:defs")
    .selectAll("marker")
    .data(["dot_blue"])
    .enter().append("viz:marker")
    .attr("id", String)
    .attr("viewBox", "-5 -5 10 10")
    .attr("refX", -13)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("viz:path")
    .attr("d", drawDot)
    .attr("fill", "#1c7a9b");

  // build the dark gray dot
  viz.append("viz:defs")
    .selectAll("marker")
    .data(["dot_dark_gray"])
    .enter().append("viz:marker")
    .attr("id", String)
    .attr("viewBox", "-5 -5 10 10")
    .attr("refX", -13)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("viz:path")
    .attr("d", drawDot)
    .attr("fill", "#383838");

  // build the light gray odot
  viz.append("viz:defs")
    .selectAll("marker")
    .data(["odot_light_gray"])
    .enter().append("viz:marker")
    .attr("id", String)
    .attr("viewBox", "-5 -5 10 10")
    .attr("refX", -20)
    .attr("refY", 0)
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("viz:path")
    .attr("d", drawOdot)
    .attr("fill", "#F9F9F9")
    .attr("stroke", "#BBB")
    .attr('stroke-width', 2);

  // build the blue odot
  viz.append("viz:defs")
    .selectAll("marker")
    .data(["odot_blue"])
    .enter().append("viz:marker")
    .attr("id", String)
    .attr("viewBox", "-5 -5 10 10")
    .attr("refX", -20)
    .attr("refY", 0)
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("viz:path")
    .attr("d", drawOdot)
    .attr("fill", "#F9F9F9")
    .attr("stroke", "#1c7a9b")
    .attr('stroke-width', 2);

  // add the links and the arrows
  var path =
    viz.append("viz:g")
    .selectAll("path")
    .data(force.links())
    .enter()
    .append("viz:path")
    .attr("class", "link")
    .attr('id', function (d, i) {
      return "linkPathId" + i;
    })
    .style("stroke", function (d) {
      return d.color;
    })
    .style("stroke-width", 2)
    .attr("marker-start", function (d) {
      return "url(#" + d.arrowtail + ")";
    })
    .attr("marker-end", function (d) {
      return "url(#" + d.arrowhead + ")";
    })
    .on("dblclick", linkDoubleClicked);

  var linktext =
    viz.append("viz:g")
    .selectAll("g.linklabelholder")
    .data(force.links())
    .enter()
    .append("g")
    .attr("class", "linklabelholder")
    .append("text")
    .attr("class", "linklabel")
    .style("font-size", "6px")
    .attr("font-family", "sans-serif")
    .attr("dy", -5)
    .attr("dx", 25)
    .attr("text-anchor", "start")
    .style("fill", "#000")
    .append("textPath")
    .attr("id", function (d, i) {
      return "textlinkPathId" + i;
    })
    .attr("xlink:href", function (d, i) {
      return "#linkPathId" + i;
    })
    .style("display", "none")
    .text(function (d) {
      linkText = d.source.name + " # " + d.target.name
      return linkText;
    });

  // define the nodes
  var viz_nodes =
    viz.selectAll(".node")
    .data(force.nodes())
    .enter().append("g")
    .attr("class", "node")
    .call(
      force.drag().origin(function (d) {
        return d;
      })
    );
  // add the nodes
  viz_nodes.append("path")
    .attr("d", function (d) {
      return d.shape;
    })
    .attr("fill", function (d) {
      return d.fillcolor;
    })
    .on("click", nodeDoubleClicked)
    .on('contextmenu', function (d) {
      d3.event.preventDefault();
      //d3.select(this).classed("fixed", d.fixed = false);
    });

  // add the text
  viz_nodes.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .style("font-size", 8)
    .attr("font-family", "sans-serif")
    .attr("fill", function (d) {
      return d.fontcolor;
    })
    .text(function (d) {
      //console.log(d);
      return d.name;
    });

  function tick() {
    path.attr("d", function (d) {
      var dr = 0;
      var heightSource = calculateHeight(d.source);
      var heightTarget = calculateHeight(d.target);
      var widthSource = calculateWidth(d.source);
      var widthTarget = calculateWidth(d.target);


      var sourceCenter = {};
      sourceCenter.y = d.source.y + (heightSource / 2);
      sourceCenter.x = d.source.x;

      var targetCenter = {};
      targetCenter.y = d.target.y + (heightTarget / 2);
      targetCenter.x = d.target.x;

      var newSource = calculateLine(sourceCenter, targetCenter, widthSource, heightSource);

      var newTarget = calculateLine(targetCenter, sourceCenter, widthTarget, heightTarget);

      return "M " +
        newSource.x + "," +
        (newSource.y - 5) + "A" +
        dr + "," + dr + " 0 0,1 " +
        newTarget.x + "," +
        (newTarget.y - 5);
    });
    viz_nodes.attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

    viz_nodes.attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  }

  function calculateHeight(node) {
    if (node.expanded) {
      return (node.attributes.length * 21 + 20);
    } else {
      return 10;
    }
  }

  function calculateWidth(node) {
    if (node.expanded) {

      if (node.attributes) {
        var maxLengthAttributeSource = getMaxLengthAttribute(node);
        return expandedWidth(maxLengthAttributeSource) + 110;
      } else {
        return expandedWidth(node.name.length);
      }
    } else {
      return expandedWidth(node.name.length) + 30;
    }
  }

  function calculateLine(source, target, width, height) {
    // NEEDS CENTER OF SOURCE AND TARGET
    halfWidth = width / 2;
    halfHeight = height / 2;

    if (source.x > target.x) {
      halfWidth *= -1
    }

    if (source.y > target.y) {
      halfHeight *= -1
    }

    var distance_x = target.x - source.x;
    var distance_y = target.y - source.y;

    var fxd = distance_x * halfHeight / distance_y;
    var fyd = distance_y * halfWidth / distance_x;

    var x = source.x + fxd;
    var y = source.y + fyd;

    var result = {}
    if (Math.abs(fxd) < Math.abs(halfWidth)) {
      result.x = x;
      result.y = source.y + halfHeight;
      return result;
    } else {
      result.x = source.x + halfWidth;
      result.y = y;
      return result;
    }
  }

};
