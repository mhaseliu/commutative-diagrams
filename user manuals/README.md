
Our project needs to be compiled and run on the CS50 IDE. After entering the "project" folder, typing "flask run" on a CS50
terminal should start running the application, which could be visited on the outputted url.

The webpage allows you to draw a commutative diagram on a grid, and then export the diagram as LaTeX. A commutative diagram consists
of boxes (labeled with either normal typing or LaTeX), and arrows (straight or curved) between the boxes. There are four buttons to
the left of the grid which will allow you to change your "mouse type", or the actions you could do with your mouse.

To start, you should click on the button labeled "box". The "box" mouse mode would then allow you to drop boxes onto the grid
wherever you click. To draw arrows, you should click on the button labeled "arrow". An arrow must be drawn between two boxes. To
begin drawing an arrow, click on the box you want the arrow to begin at. To end drawing an arrow, click on the box you want the
arrow to end at. If you want your arrow to curve, you can click on the grid (outside of boxes) while you draw the arrow, which
would add a control point for the curve.

If you want to add text to a box, you should first click on the "select" button. When you click on a box, you have selected it, and
you can proceed to type a label for the box into the box. If you wish to label a button with LaTeX, you can type LaTeX commands into
the box, the webpage will automatically generate the LaTeX. When your mouse is on "select" mode, you can also move boxes. To move a
box, you can simply click on a box and drag it to wherever you want it to be. If any arrows are pointing to or from your box, moving
the box will move the endpoints of the arrow with it. You could also move around control points for arrows by dragging them.

To delete arrows or boxes, you could clock on the "delete" button. The "delete" mouse mode will allow you to delete boxes and arrows
when you click on them. If any arrows are pointing to or from a box that you delete, the arrows will also be deleted.

Finally, when you are done drawing your commutative diagram, you could click on the button labeled "Export as LaTeX". The LaTeX for
your commutative diagram will appear to the right of the grid, and you can simply copy paste it to wherever you need it.

A visual demonstration can be found at https://www.youtube.com/watch?time_continue=12&v=LBg1KDZljmg.