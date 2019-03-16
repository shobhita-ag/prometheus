

order_next_status_map = {
	1: "Order Created",
	2: "Sent to Shooting",
	(3, "Shooting Completed"),
	(4, "Pose Selection Started"),
	(5, "Pose Selection Completed"),
	(6, "Pose Cutting Started"),
	(7, "Pose Cutting Completed"),
	(8, "Layout Creation Started"),
	(9, "Layout Creation Completed"),
	(10, "Color Correction Started"),
	(11, "Color Correction Completed"),
	(12, "Dummy Sent to Client"),
	(13, "Changes Taken"),
	(14, "Changes Implementation Started"),
	(15, "Changes Implementation Completed"),
	(16, "Printing Started"),
	(17, "Printing Completed"),
	(18, "Bill Created"),
	(19, "Delivery Done"),
}

def get_next_status(order):
