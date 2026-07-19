from PIL import Image

try:
    img = Image.open('frame.jpg')
    width, height = img.size
    print(f"Image size: {width}x{height}")
    # We want to find the green screen. It's roughly in the bottom half, centered horizontally.
    # Let's just crop the bottom half and look for the bounding box of green pixels.
    # The green screen color is probably a distinct yellowish-green.
    
    # Or, we can just print out a small ascii art of a 100x100 grid of the image to see where the phone is!
    # Even easier: resize to 80x40 and print it out with characters!
    img_small = img.resize((80, 45))
    pixels = img_small.load()
    
    for y in range(45):
        line = ""
        for x in range(80):
            r, g, b = pixels[x, y]
            # check if it's the green screen color
            if g > r + 20 and g > b + 20: # simple green check
                line += "O"
            else:
                line += "."
        print(f"{y:02d} " + line)

except Exception as e:
    print(e)
