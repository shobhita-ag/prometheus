

order_next_status_map = {
	1: ("Send for Shooting", 2),
	2: ("Complete Shooting", 3),
	3: ("Start Pose Selection", 4),
	4: ("Complete Pose Selection", 5),
	5: ("Start Pose Cutting", 6),
	6: ("Complete Pose Cutting", 7),
	7: ("Start Layout Creation", 8),
	8: ("Complete Layout Creation", 9),
	9: ("Start Color Correction", 10),
	10: ("Complete Color Correction", 11),
	11: ("Send Dummy to Client", 12),
	12: ("Accept Changes from Client", 13),
	13: ("Start Implementating Changes", 14),
	14: ("Complete Implementating Changes", 15),
	15: ("Start Printing", 16),
	16: ("Complete Printing", 17),
	17: ("Create Bill", 18),
	18: ("Delivery Done", 19)
}

order_next_status_template_map = {
	2: 'shoot_dialog.html',
	3: 'shoot_dialog.html',
	4: 'pose_dialog.html',
	5: 'pose_dialog.html',
	6: 'cutting_dialog.html',
	7: 'cutting_dialog.html',
	8: 'layout_dialog.html',
	9: 'layout_dialog.html',
	10: 'color_correction_dialog.html',
	11: 'color_correction_dialog.html',
	12: 'dummy_sent_dialog.html',
	13: 'chnages_taken_dialog.html',
	14: 'changes_implementation_dialog.html',
	15: 'changes_implementation_dialog.html',
	16: 'printing_dialog.html',
	17: 'printing_dialog.html',
	18: 'bill_creation_dialog.html',
	19: 'delivery_dialog.html'
}

order_next_status_model_map = {
	2: 'Shoot',
	3: 'Shoot',
	4: 'PoseSelection',
	5: 'PoseSelection',
	6: 'PoseCutting',
	7: 'PoseCutting',
	8: 'Layout',
	9: 'Layout',
	10: 'ColorCorrection',
	11: 'ColorCorrection',
	12: 'DummySent',
	13: 'ChangesTaken',
	14: 'ChangesImplementation',
	15: 'ChangesImplementation',
	16: 'Printing',
	17: 'Printing',
	18: 'BillCreation',
	19: 'Delivery'
}

order_next_status_serializer_map = {
	2: 'ShootSerializer',
	3: 'ShootSerializer',
	4: 'PoseSelectionSerializer',
	5: 'PoseSelectionSerializer',
	6: 'PoseCuttingSerializer',
	7: 'PoseCuttingSerializer',
	8: 'LayoutSerializer',
	9: 'LayoutSerializer',
	10: 'ColorCorrectionSerializer',
	11: 'ColorCorrectionSerializer',
	12: 'DummySentSerializer',
	13: 'ChangesTakenSerializer',
	14: 'ChangesImplementationSerializer',
	15: 'ChangesImplementationSerializer',
	16: 'PrintingSerializer',
	17: 'PrintingSerializer',
	18: 'BillCreationSerializer',
	19: 'DeliverySerializer'
}

def get_next_status(order):
	next_status_tuple = order_next_status_map.get(order.status, None)
	if next_status_tuple:
		return {"name": next_status_tuple[0], "value": next_status_tuple[1]}
	return None