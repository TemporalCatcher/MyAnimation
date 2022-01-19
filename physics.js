// This is the functions for the physics engine

function updateVelocity (velocity, acceleration, deltaTime) {
    return velocity + acceleration * deltaTime;
}

function updatePosition (position, velocity, acceleration, deltaTime) {
    return position + velocity * deltaTime + 1 / 2 * acceleration * deltaTime * deltaTime;
}

function bounceTime(pos, bound, vel, acc) {
    // 1/2adt^2 + vdt + i_x = f_x
    // 1/2adt^2 + vdt + (-1)dx
    // quadratic of positive x: (-b + sqrt(b^2-4ac)) / (2a)
    // a = 1/2 a; b = v; c = -dx
    // (-v + sqrt(v^2-4*(1/2)a*(-1)dx))/(2(1/2)a) = (-v + sqrt(v^2+2adx))/a
    const a = (-vel + Math.sqrt(vel*vel+2*acc*(bound-pos))) / acc;
    const b = (-vel - Math.sqrt(vel*vel+2*acc*(bound-pos))) / acc;
    if (vel*acc > 0)
        return Math.max(a, b);
    return Math.min(a,b);
}

// allows for 1 dimensional bounce off horizontal or vertical surfaces
function bounce(pos, offset, bound, vel, acc, bounciness, dt) {
    let d1 = 0;
    let d2 = 0;
    if (acc == 0) {
        // f_x = i_x + v * dt
        // dx/v = dt
        d1 = (bound-pos-offset)/vel;
        d2 = dt - d1;
    }
    else {
        {
            const a = (-vel + Math.sqrt(vel*vel+2*acc*(bound-pos))) / acc;
            const b = (-vel - Math.sqrt(vel*vel+2*acc*(bound-pos))) / acc;
            if (vel*acc > 0)
                d1 =Math.max(a, b); 
            else d1 = Math.min(a,b);
        }
        //d1 = bounceTime(pos + offset, bound, vel, acc);
        d2 = dt - d1;
    }
    let temp = updatePosition(pos, vel, acc, d1);
    vel = updateVelocity(vel, acc, d1);
    vel *= -bounciness;
    let wall = false;
    if (vel > -2 && vel < 2) {
        wall = true;
        temp = bound-offset;
        vel = 0;
    }
    else {
        temp = updatePosition(temp, vel, acc, d2);
        vel = updateVelocity(vel, acc, d2);
    }
    return [temp, vel, wall];
}

// allows for 1d collision detection
function static_collision(pos, offset, bound, vel) {
    pos = bound - offset;
    if (bound - pos - offset < 0) 
        if (vel > 0) vel = 0;
    else 
        if (vel < 0) vel = 0;
    return [pos, vel];
}