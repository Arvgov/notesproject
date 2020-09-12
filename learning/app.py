from tkinter import Tk, Canvas, Frame, Button, BOTH


class Example(Frame):
    def __init__(self, dataset):
        super().__init__(bg = "black")

        #root = Tk()
        #root.geometry("600x600")

        self.dataset = dataset
        self.i = 300
        self.initUI()
        self.mainloop()


    def draw(self):
        self.canvas.delete("all")
        line = 50 + 400 * (self.dataset[self.i][0].reshape(-1) + 0.5)
        line = line.numpy().astype(int).tolist()
        self.canvas.create_line(*line)


    def initUI(self):
        self.master.title("Lines")
        self.pack(fill=BOTH, expand=1)

        self.canvas = Canvas(self, bg="#ddd", width = 500, height = 500)
        self.draw()

        self.canvas.pack()
        Button(self, text="next", command=self.n).pack()
        Button(self, text="back", command = self.b).pack()

    def n(self):
        self.i += 1
        self.draw()
    def b(self):
        self.i -= 1
        self.draw()
