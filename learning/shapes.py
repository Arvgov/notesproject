import torch
from export import export
import torch.nn as nn
from app import Example
import torch.optim as optim
import random
from random import shuffle
import torchvision.models as models
from torchvision import transforms
from torch.utils.data import Dataset, DataLoader
import json
import numpy as np
from models import *
from dataset import *
import os





transforms = transforms.Compose([Whiten(), ToNumPoints(128)])
dataset = ShapeDataset(None, None, circle_file = ["test.nt"], rect_file = [])
dataset.transform = transforms
train_dataloader = DataLoader(dataset, shuffle = True, batch_size = 1)
for (x, y) in train_dataloader:
    print(x)

raise 3








circles = [os.path.join("data", i) for i in filter(lambda x: "circles" in x, os.listdir("data"))]
rects = [os.path.join("data", i) for i in filter(lambda x: "rects" in x, os.listdir("data"))]
print(circles)
print(rects)

train_transforms = transforms.Compose([Whiten(), ToNumPoints(128), RandomReverse(), RotatePointsRandomly()])
test_transforms = transforms.Compose([Whiten(), ToNumPoints(128), RandomReverse(), RotatePointsRandomly()])

dataset = ShapeDataset(None, None, circle_file = circles,\
                       rect_file = rects)
train_dataset, test_dataset = dataset.seeded_split(0.75)
train_dataset.transform = train_transforms
test_dataset.transform = test_transforms

train_dataloader = DataLoader(train_dataset, shuffle = True, batch_size = 16)
test_dataloader = DataLoader(test_dataset, batch_size = 16)

# Example(train_dataset)
model_func = model1

model, name = model_func()
print(name)

optimizer = optim.AdamW(model.parameters(), weight_decay = .0001)
criterion = nn.CrossEntropyLoss()
model.train()

max_accuracy = 0
no_improvements = 0
for i in range(300):
    correct, total = 0, 0.0
    model.train()
    for (x, y) in train_dataloader:
        x = x.transpose(2, 1)
        x = x[..., None]
        # print(x.shape)
        optimizer.zero_grad()
        y_pred = model(x)
        assert y_pred.shape[1] == 2
        loss = criterion(y_pred, y)
        total += len(y_pred)
        correct += (y_pred.argmax(dim=1) == y).sum().item()
        loss.backward()
        optimizer.step()

    if i % 5 == 0:
        pass #print("train", correct/total*100)

    correct, total = 0.0, 0.0
    model.eval()
    with torch.no_grad():
        for (x, y) in test_dataloader:
            x = x.transpose(2, 1)
            x = x[..., None]
            y_pred = model(x).argmax(dim=1)
            correct += (y_pred == y).sum().item()
            total += len(y)

    if correct/total > max_accuracy:
        max_accuracy = correct/total
        no_improvements = 0
        print("max", max_accuracy*100)
        torch.save(model.state_dict(), name + ".pt")
    else:
        no_improvements += 1

    if no_improvements > 25:
        print(max_accuracy * 100)
        break

export(model_func)




