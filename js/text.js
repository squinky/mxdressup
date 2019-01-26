var text =
{
	prompt: "dress for #occasion#",

	mealAdj: "awkward delicious expensive ostentatious pleasant quick quiet tense uncomfortable".split(" "),
	meal: "breakfast brunch dinner lunch supper tea coffee".split(" "),
	ages: "ages years decades forever".split(" "),

	people:
	[
		"a complete stranger",
		"a bunch of strangers",
		"your friends",
		"your best friend",
		"your parents",
		"your mom",
		"your brother",
		"your sister",
		"your #teacherType# teacher",
		"your #profType# professor",
		"your PhD supervisor",
		"your childhood hero",
		"someone you haven't seen in #ages#",
		"Beyonce",
		"#people# and #people#"
	],

	teacherType:
	[
		"grade six",
		"high school English",
		"high school physics",
		"high school band",
		"piano",
		"violin"
	],

	profType:
	[
		"computer science",
		"discrete math",
		"women's studies",
		"English",
		"philosophy"
	],

	activity:
	[
		"band practice",
		"choir practice",
		"dance class",
		"board games with #people#",
		"playing Mario Kart with #people#",
		"taking selfies in your bedroom",
		"the Game Developers Conference"
	],

	occasion:
	[
		"#mealAdj.a# #meal# with #people#",
		"#activity#"
	]
};