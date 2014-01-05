#! /usr/bin/env python
# Copyright (c) 2014, Jan Michael C Alonzo
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions
# are met:
#
# 1. Redistributions of source code must retain the above copyright
# notice, this list of conditions and the following disclaimer.
#
# 2. Redistributions in binary form must reproduce the above copyright
# notice, this list of conditions and the following disclaimer in the
# documentation and/or other materials provided with the distribution.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
# FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
# COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
# INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
# BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
# LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
# ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.

import collections
import json
import os
import os.path
import sys

import lxml.html as lh

DATA_DIR = "data"
EXCLUDE_DIRS = ['_borders']
EXCLUDE_FILES = ['all_translations.htm', 'index.htm', 'indexchp.htm']
EXTENSION = ".json"
AUTHORS = "authors"

def is_float(s):
    try:
        float(s)
        return True
    except (TypeError, ValueError):
        pass

    return False


def parse(filename):
    author_content = dict()
    with open(filename, "rb") as fn:
        document = lh.parse(fn)
        table = document.find("body").findall("table")[1]
        content = unicode(table.xpath('string()'))
        start = 0
        try:
            start = content.index("1.1")
        except ValueError:
            try:
                # Rosenberg translation
                start = content.index("1.")
            except ValueError:
                if "Chapter 1" in content:
                    # Gibbs translation
                    start = content.index("Chapter 1")
                else:
                    # Feng translation!
                    start = content.index("1")

        content = unicode(content[start:])
        chap, verse = '', ''
        for line in content.splitlines():
            if not line or not len(line.strip()):
                continue

            if line.startswith("Chapter"):
                # Deal with the Gibbs translation
                line = line.partition(' ')[2]

            if not is_float(line.partition(' ')[0]):
                author_content[chap] += " " + line
            else:
                chap, _, verse = line.partition(' ')
                chap = unicode(abs(float(chap)))
                author_content[chap] = verse

    return collections.OrderedDict(sorted(author_content.items(),
                                          key=lambda x: float(x[0])))


def main():
    authors = collections.OrderedDict()
    for root, dirs, files in os.walk("./site/wayist.org/ttc compared"):
        current_dir = root.split('/')
        if current_dir[len(current_dir) - 1] in EXCLUDE_DIRS:
            continue

        for f in files:
            if f in EXCLUDE_FILES:
                continue

            filename = os.path.join(root, f)
            if not f.startswith('chap'):
                print >> sys.stdout, "Processing %s" % f
                authors[f.split('.')[0]] = parse(filename)

    # Write out the authors
    with open(os.path.join(DATA_DIR, AUTHORS + EXTENSION), 'wb') as f:
        f.write(json.dumps(authors.keys()))

    # For optimization purposes, each author translation of the book
    # is written out to a separate file, loaded when that translation
    # is selected, and cached for future access to that version.
    for author in authors:
        with open(os.path.join(DATA_DIR, author + EXTENSION), 'wb') as f:
            f.write(json.dumps([authors.get(author)]))

    print >> sys.stdout, "Processed %s authors" % len(authors.keys())

if __name__ == '__main__':
    main()
