define([], function() {
	var Unicode = {
		// box[top][right][bottom][left]
		// s = single; d = double; n = none
		box: {
			s: {
				s: {
					s: {
						n: "├",
						s: "┼"
					},
					d: {},
					n: {
						n: "└",
						s: "┴"
					}
				},
				d: {
					s: {
						n: "╞",
						d: "╪"
					},
					d: {},
					n: {
						n: "╘",
						d: "╧"
					}
				},
				n: {
					s: {
						n: "│",
						s: "┤",
						d: "╡"
					},
					d: {},
					n: {
						d: "╛"
					}
				}
			},
			d: {
				s: {
					s: {},
					d: {
						n: "╟",
						s: "╫"
					},
					n: {
						n: "╙",
						s: "╨"
					}
				},
				d: {
					s: {},
					d: {
						n: "╠",
						d: "╬"
					},
					n: {
						n: "╚",
						d: "╩"
					}
				},
				n: {
					s: {},
					d: {
						n: "║",
						s: "╢",
						d: "╣"
					},
					n: {
						s: "╜",
						d: "╝"
					}
				}
			},
			n: {
				s: {
					s: {
						n: "┌",
						s: "┤"
					},
					d: {
						n: "╓",
						s: "╥"
					},
					n: {
						s: "─"
					}
				},
				d: {
					s: {
						n: "╒",
						d: "╤"
					},
					d: {
						n: "╔",
						d: "╦"
					},
					n: {
						d: "═"
					}
				},
				n: {
					s: {
						s: "┐",
						d: "╕"
					},
					d: {
						s: "╖",
						d: "╗"
					},
					n: {}
				}
			}
		},
		block: {
			full: "█"
		}
	}

	return Unicode;
});