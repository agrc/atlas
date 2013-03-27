import unittest
import glob
import os
import importlib


suite = unittest.TestSuite()

for file in glob.glob('tests/test_*.py'):
    modname = os.path.splitext(file)[0].replace('/', '.')
    print modname
    module = importlib.import_module(modname)
    suite.addTest(unittest.TestLoader().loadTestsFromModule(module))

unittest.TextTestRunner(verbosity=2).run(suite)