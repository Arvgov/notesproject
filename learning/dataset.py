from torch.utils.data import Dataset
import numpy as np
import json
import torch
import random
from random import shuffle


class ShapeDataset(Dataset):
    def __init__(self, circle_data, rect_data, circle_file = None,
                rect_file = None, transform = None):
        if circle_file is not None:
            self.circle_data = self.load_from_nt(circle_file)
            self.rect_data = self.load_from_nt(rect_file)
        else:
            self.circle_data = circle_data
            self.rect_data = rect_data
        print("circles", len(self.circle_data))
        print("rects", len(self.rect_data))
        self.transform = transform

    def seeded_split(self, fraction, seed = 0):
        random.seed(seed)
        circles_a, circles_b = self.split_data(fraction, self.circle_data)
        rects_a, rects_b = self.split_data(fraction, self.rect_data)
        return ShapeDataset(circles_a, rects_a, transform = self.transform),\
               ShapeDataset(circles_b, rects_b, transform = self.transform)

    def split_data(self, fraction, data):
        indices = list(range(len(data)))
        shuffle(indices)
        cutoff = int(fraction * len(data))
        a, b = indices[0: cutoff], indices[cutoff:]
        return [data[i].copy() for i in a],\
               [data[i].copy() for i in b]

    def load_from_nt(self, files):
        shapes = []
        for i in files:
            with open(i, "r") as f:
                strokes = json.load(f)["strokes"]
                for stroke in strokes:
                    if len(stroke["points"]) > 10:
                        trimmed = stroke["points"][3:-4]
                        shapes.append(np.array(trimmed).astype(float))
        return shapes


    def __len__(self):
        return len(self.circle_data) + len(self.rect_data)

    def __getitem__(self, i):
        if i < len(self.circle_data):
            x, y = self.circle_data[i], torch.tensor(1)
        else:
            idx = i - len(self.circle_data)
            x, y = self.rect_data[idx], torch.tensor(0)
        x = torch.tensor(self.transform(x) if self.transform else x).float()

        assert x.shape == (128, 2), x.shape
        assert y.shape == (), y.shape
        return x, y

class Whiten():
    def __init__(self):
        pass

    def __call__(self, arr):
        return self.whiten_data(arr)

    def whiten_data(self, data):
        data = data.copy()
        xmin, xmax = float(np.min(data[:, 0])), float(np.max(data[:, 0]))
        ymin, ymax = float(np.min(data[:, 1])), float(np.max(data[:, 1]))
        data[:, 0] -= (xmin + xmax) / 2.0
        data[:, 1] -= (ymin + ymax) / 2.0
        data[:, 0] = data[:, 0] / (xmax - xmin)
        data[:, 1] = data[:, 1] / (ymax - ymin)

        return data

class RotatePointsRandomly():
    def __init__(self):
        pass

    def __call__(self, points):
        theta = np.radians(np.random.randint(360))
        c, s = np.cos(theta), np.sin(theta)
        transform = np.array(((c, -s), (s, c)))
        rotated = (transform @ points[..., None]).squeeze()
        assert len(rotated.shape) == 2
        return rotated

class ToNumPoints():
    def __init__(self, num_points):
        self.num_points = num_points

    def __call__(self, stroke):
        if len(stroke) > self.num_points:
            stroke = self.shorten_stroke(stroke, self.num_points)
        elif len(stroke) < self.num_points:
            stroke = self.pad_stroke(stroke, self.num_points)
        assert stroke.shape == (self.num_points, 2)
        return stroke

    def shorten_stroke(self, arr, length):
        assert len(arr) > length

        # array of indices to remove
        num_to_remove = len(arr) - length
        to_remove = np.linspace(0, len(arr), num = num_to_remove,
                                endpoint = False)
        to_remove = to_remove.astype(int)
        assert len(to_remove) == num_to_remove
        assert len(to_remove) == len(set(to_remove)), (len(arr), length)

        # mask of indices to remove
        mask = np.ones(len(arr), dtype=bool)
        mask[to_remove] = False
        arr = arr[mask, :]
        assert arr.shape == (length, 2)

        return arr

    def pad_stroke(self, arr, length):
        pad = length - len(arr)
        front_pad = pad // 2
        back_pad = pad - front_pad
        pad_width = ((front_pad, back_pad), (0, 0))
        stroke = np.pad(arr, pad_width = pad_width, mode = 'edge')
        assert stroke.shape == (length, 2)
        return stroke

class RandomReverse():
    def __init__(self):
        pass

    def __call__(self, data):
        assert data.shape[1] == 2
        return np.flip(data, axis = 0)


class PerturbPointsRandomly():
    def __init__(self):
        pass

    def __call__(self, data):
        return data + np.random.normal(scale = .005, size = data.shape)
