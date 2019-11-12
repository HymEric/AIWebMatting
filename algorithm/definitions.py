import os
from functools import partial

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_DIR = os.path.join(ROOT_DIR, 'config')

absolute = partial(os.path.join, ROOT_DIR)
