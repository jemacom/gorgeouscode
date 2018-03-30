function expandedWidth(maxLengthAttribute) {
    return maxLengthAttribute * 3
}

function drawStub() {
    return 'M 0,0 m -1,-5 L 1,-5 L 1,5 L -1,5 Z'
}

function drawDiamond() {
    return 'M -10,0 L 0,6 L 10,0 L 0,-6 Z'
}

function drawSingleArrow() {
    return 'M -3,-5 L 7,0 L -3,5'
}

function drawDoubleArrow() {
    return 'M -3,-5 L 7,0 L -3,5 M 7,-5 L 17,0 L 7,5'
}

function drawDoubleArrowBackwards() {
    return 'M 7,-5 L -3,0 L 7,5 M 17,-5 L 7,0 L 17,5'
}

function drawTripleArrow() {
    return 'M -3,-5 L 7,0 L -3,5 M 7,-5 L 17,0 L 7,5 M 17,-5 L 27,0 L 17,5'
}

function drawDot() {
    return 'M 0, 0  m -3, 0  a 3,3 0 1,0 6,0  a 3,3 0 1,0 -6,0'
}

function drawCrow() {
    return 'M 0,-5 L 10,0 L 0,5'
}

function drawOdot() {
    return "M 0, 0  m -5, 0  a 5,5 0 1,0 10,0  a 5,5 0 1,0 -10,0"
}

function drawRect(x, y, width, height) {
    return "M" + x + "," + y
        + "h" + (width)
        + "v" + (height)
        + "h" + (width)
        + "v" + (-height)
        + "z";
}

function drawNodeElipse(attrLength) {
    return "M -" + (attrLength + ELIPSE_WIDTH_FACTOR) * 2.5 + ",0 "
        + "a" + (attrLength + ELIPSE_WIDTH_FACTOR) * 2.5 + ",10 0 1,0 " + (attrLength + ELIPSE_WIDTH_FACTOR) * 5 + ",0"
        + "a" + (attrLength + ELIPSE_WIDTH_FACTOR) * 2.5 + ",10 0 1,0 -" + (attrLength + ELIPSE_WIDTH_FACTOR) * 5 + ",0"
}

function drawNodeRect(attrLength) {
    return "M 0,0 m " + -(attrLength * RECT_WIDTH_FACTOR) + ",-10 "
        + "L " + (attrLength * RECT_WIDTH_FACTOR) + ",-10 "
        + "L " + (attrLength * RECT_WIDTH_FACTOR) + ",10 "
        + "L " + -(attrLength * RECT_WIDTH_FACTOR) + ",10 "
        + " Z"
}

function drawNodeExpandedRect(numOfAttributes, expandedWidth) {
    return "M " + -expandedWidth + "," + EXPANDED_TOP_PADDING
        + "L " + expandedWidth + "," + EXPANDED_TOP_PADDING
        + "L " + expandedWidth + "," + (numOfAttributes * 21 + 20)
        + "L " + -expandedWidth + "," + (numOfAttributes * 21 + 20)
        + " Z"
}

function drawNodeExpandedRoundedRect(numOfAttributes, expandedWidth, radius) {
    return "M" + (radius - expandedWidth - 12) + "," + EXPANDED_TOP_PADDING
        + " h" + (2 * expandedWidth - radius)
        + " a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
        + " v" + (numOfAttributes * 21 + 25 - (2 * radius))
        + " a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
        + " h" + (2 * radius - (2 * expandedWidth))
        + " a" + radius + "," + radius + " 0 0 1 " + -radius + "," + -radius
        + " v" + (-numOfAttributes * 21 - 25 + (2 * radius))
        + " a" + radius + "," + radius + " 0 0 1 " + radius + "," + -radius
        + " Z"
}

function drawRoundedRect(x, y, width, height, radius) {
    return "M" + x + radius + "," + y
        + " h" + (width - radius)
        + " a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
        + " v" + (height - 2 * radius)
        + " a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
        + " h" + (2 * radius - width)
        + " a" + radius + "," + radius + " 0 0 1 " + -radius + "," + -radius
        + " v" + (-height + 2 * radius)
        + " a" + radius + "," + radius + " 0 0 1 " + radius + "," + -radius
        + " Z"
}