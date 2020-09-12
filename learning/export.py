import torch
import torch.onnx


def export(model_func):
    model, name = model_func()
    print(name)
    saved = torch.load(name + ".pt")
    model.load_state_dict(saved)


    model.eval()
    x = torch.randn(1, 2, 128, 1, requires_grad = True)
    print(x.shape)

    torch.onnx.export(model,                     # model being run
                      x,                         # model input (or a tuple for multiple inputs)
                      name + ".onnx",            # where to save the model (can be a file or file-like object)
                      export_params=True,        # store the trained parameter weights inside the model file
                      opset_version=10,          # the ONNX version to export the model to
                      do_constant_folding=True,  # whether to execute constant folding for optimization
                      input_names = ['input'],   # the model's input names
                      output_names = ['output']) # the model's output names
