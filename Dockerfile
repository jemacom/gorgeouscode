FROM docker.freeletics.com/rails-baseimage:2018-03-21_11-14 

RUN curl -sSL https://rvm.io/mpapis.asc | gpg --import \
    && curl -sL https://get.rvm.io | bash -s stable \	
    && bash -il -c "rvm requirements" \ 
    && echo "rvm_install_on_use_flag=1" >> /etc/rvmrc \
    && echo "bundler" >> /usr/local/rvm/gemsets/default.gems \ 
    && rm -rf /var/lib/apt/lists/*

RUN bash -il -c "rvm install 2.5.0"
