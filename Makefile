all:
	python generate_jack_drawing.py

clean:
	rm sprites/*.gen DrawSprites.jack *.vm

.PHONY: all
