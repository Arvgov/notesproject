import torch.nn as nn

def model1():
    layers = [nn.Conv2d(2, 4, (3, 1), stride=(2, 1), padding=(1, 0)), nn.BatchNorm2d(4), nn.LeakyReLU(),
              nn.Conv2d(4, 8, (3, 1), stride=(2, 1), padding=(1, 0)), nn.BatchNorm2d(8), nn.LeakyReLU(),
              nn.Conv2d(8, 16, (3, 1), stride=(2, 1), padding=(1, 0)), nn.BatchNorm2d(16), nn.LeakyReLU(),
              nn.Conv2d(16, 32, (3, 1), stride=(2, 1), padding=(1, 0)), nn.BatchNorm2d(32), nn.LeakyReLU(),
              nn.Conv2d(32, 1, (3, 1), stride=(4, 1)), nn.Flatten()]
    return nn.Sequential(*layers), "model1"


def model2():
    layers = [nn.Conv2d(2, 2, (3, 1), stride=(2, 1), padding=(1, 0)), nn.BatchNorm2d(2), nn.LeakyReLU(),
              nn.Conv2d(2, 4, (3, 1), stride=(2, 1), padding=(1, 0)), nn.BatchNorm2d(4), nn.LeakyReLU(),
              nn.Conv2d(4, 8, (3, 1), stride=(2, 1), padding=(1, 0)), nn.BatchNorm2d(8), nn.LeakyReLU(),
              nn.Conv2d(8, 16, (3, 1), stride=(2, 1), padding=(1, 0)), nn.BatchNorm2d(16), nn.LeakyReLU(),
              nn.Conv2d(16, 1, (3, 1), stride=4), nn.Flatten()]
    return nn.Sequential(*layers), "model2"




